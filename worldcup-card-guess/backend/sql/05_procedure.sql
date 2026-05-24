SET NAMES utf8mb4;

DELIMITER //

DROP PROCEDURE IF EXISTS sp_finish_match_and_settle_points//

CREATE PROCEDURE sp_finish_match_and_settle_points(
  IN p_match_id INT,
  IN p_home_score INT,
  IN p_away_score INT
)
BEGIN
  DECLARE v_match_count INT DEFAULT 0;
  DECLARE v_status VARCHAR(20);
  DECLARE v_result VARCHAR(10);

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  IF p_home_score < 0 OR p_away_score < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '录入比分不能为负数';
  END IF;

  START TRANSACTION;

  SELECT COUNT(*), MAX(status)
    INTO v_match_count, v_status
  FROM worldcup_match
  WHERE match_id = p_match_id
  FOR UPDATE;

  IF v_match_count = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛不存在，不能结算';
  END IF;

  IF v_status = 'finished' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛已经完成，不能重复结算';
  END IF;

  IF v_status = 'canceled' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '比赛已取消，不能结算';
  END IF;

  SET v_result = CASE
    WHEN p_home_score > p_away_score THEN 'home'
    WHEN p_home_score = p_away_score THEN 'draw'
    ELSE 'away'
  END;

  UPDATE worldcup_match
  SET home_score = p_home_score,
      away_score = p_away_score,
      status = 'finished'
  WHERE match_id = p_match_id;

  UPDATE match_guess
  SET is_correct = (guess_result = v_result),
      points_awarded =
        CASE
          WHEN guess_result = v_result
            THEN 10 + CASE WHEN guess_home_score = p_home_score AND guess_away_score = p_away_score THEN 20 ELSE 0 END
          ELSE 0
        END
  WHERE match_id = p_match_id;

  INSERT INTO point_record (user_id, match_id, points_change, reason)
  SELECT user_id,
         match_id,
         points_awarded,
         CASE
           WHEN points_awarded = 30 THEN '猜中胜平负和准确比分'
           WHEN points_awarded = 10 THEN '猜中胜平负'
           ELSE '未猜中，不加分'
         END
  FROM match_guess
  WHERE match_id = p_match_id;

  UPDATE user_info u
  JOIN (
    SELECT user_id, SUM(points_awarded) AS added_points
    FROM match_guess
    WHERE match_id = p_match_id
    GROUP BY user_id
  ) s ON u.user_id = s.user_id
  SET u.total_points = u.total_points + s.added_points;

  COMMIT;
END//

DELIMITER ;
