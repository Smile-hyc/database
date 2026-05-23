-- 1. 事务删除演示：后端 DELETE /api/matches/:matchId 会执行同样的事务逻辑。
START TRANSACTION;
DELETE FROM match_guess WHERE match_id = 8;
DELETE FROM point_record WHERE match_id = 8;
DELETE FROM card_value_record WHERE match_id = 8;
DELETE FROM worldcup_match WHERE match_id = 8;
COMMIT;

-- 2. 触发器成功演示：未开始比赛、未重复、比分非负。
INSERT INTO match_guess (user_id, match_id, guess_result, guess_home_score, guess_away_score)
VALUES (4, 1, 'home', 2, 0);

-- 3. 触发器失败演示：finished 比赛会被阻止。
INSERT INTO match_guess (user_id, match_id, guess_result, guess_home_score, guess_away_score)
VALUES (4, 9, 'away', 0, 2);

-- 4. 存储过程成功演示：录入赛果并结算积分。
CALL sp_finish_match_and_settle_points(2, 2, 0);

-- 5. 存储过程失败演示：重复结算 finished 比赛会报错。
CALL sp_finish_match_and_settle_points(9, 2, 1);

-- 6. 视图查询演示。
SELECT * FROM v_user_ranking;
SELECT * FROM v_card_market;
