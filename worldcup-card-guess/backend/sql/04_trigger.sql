SET NAMES utf8mb4;

DELIMITER //

DROP TRIGGER IF EXISTS trg_before_insert_match_guess//

CREATE TRIGGER trg_before_insert_match_guess
BEFORE INSERT ON match_guess
FOR EACH ROW
BEGIN
  DECLARE v_match_count INT DEFAULT 0;
  DECLARE v_match_status VARCHAR(20);
  DECLARE v_match_time DATETIME;
  DECLARE v_duplicate_count INT DEFAULT 0;

  SELECT COUNT(*), MAX(status), MAX(match_time)
    INTO v_match_count, v_match_status, v_match_time
  FROM worldcup_match
  WHERE match_id = NEW.match_id;

  IF v_match_count = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛不存在，不能提交竞猜';
  END IF;

  IF v_match_status <> 'upcoming' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛不是未开始状态，不能提交竞猜';
  END IF;

  IF NOW() >= v_match_time THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛已经开始，不能再提交竞猜';
  END IF;

  SELECT COUNT(*)
    INTO v_duplicate_count
  FROM match_guess
  WHERE user_id = NEW.user_id AND match_id = NEW.match_id;

  IF v_duplicate_count > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '同一个用户对同一场比赛只能竞猜一次';
  END IF;

  IF NEW.guess_home_score < 0 OR NEW.guess_away_score < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '预测比分不能为负数';
  END IF;
END//

DELIMITER ;
