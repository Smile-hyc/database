SET NAMES utf8mb4;

INSERT INTO national_team (team_id, team_name, country_code, flag_url, fifa_rank, group_name) VALUES
(1, 'Argentina', 'ARG', 'https://flagcdn.com/w80/ar.png', 1, 'A'),
(2, 'France', 'FRA', 'https://flagcdn.com/w80/fr.png', 2, 'A'),
(3, 'Brazil', 'BRA', 'https://flagcdn.com/w80/br.png', 5, 'B'),
(4, 'England', 'ENG', 'https://flagcdn.com/w80/gb-eng.png', 4, 'B'),
(5, 'Portugal', 'POR', 'https://flagcdn.com/w80/pt.png', 6, 'C'),
(6, 'Spain', 'ESP', 'https://flagcdn.com/w80/es.png', 8, 'C'),
(7, 'Germany', 'GER', 'https://flagcdn.com/w80/de.png', 10, 'D'),
(8, 'Netherlands', 'NED', 'https://flagcdn.com/w80/nl.png', 7, 'D');

INSERT INTO user_info (user_id, username, nickname, total_points, favorite_team_id) VALUES
(1, 'leo_fan', '蓝白十号', 30, 1),
(2, 'paris_speed', '巴黎冲刺', 10, 2),
(3, 'samba_star', '桑巴玩家', 20, 3),
(4, 'three_lions', '三狮经理', 0, 4),
(5, 'card_trader', '卡市观察员', 40, 5);

INSERT INTO player (player_id, player_name, team_id, position, age, club, market_value, photo_url, is_in_squad) VALUES
(1, 'Lionel Messi', 1, 'FW', 38, 'Inter Miami', 3000.00, '', TRUE),
(2, 'Julian Alvarez', 1, 'FW', 26, 'Atletico Madrid', 9000.00, '', TRUE),
(3, 'Emiliano Martinez', 1, 'GK', 33, 'Aston Villa', 2800.00, '', TRUE),
(4, 'Kylian Mbappe', 2, 'FW', 27, 'Real Madrid', 18000.00, '', TRUE),
(5, 'Antoine Griezmann', 2, 'MF', 35, 'Atletico Madrid', 2500.00, '', TRUE),
(6, 'Mike Maignan', 2, 'GK', 30, 'AC Milan', 4000.00, '', TRUE),
(7, 'Vinicius Junior', 3, 'FW', 25, 'Real Madrid', 15000.00, '', TRUE),
(8, 'Rodrygo', 3, 'FW', 25, 'Real Madrid', 10000.00, '', TRUE),
(9, 'Alisson Becker', 3, 'GK', 33, 'Liverpool', 3500.00, '', TRUE),
(10, 'Harry Kane', 4, 'FW', 32, 'Bayern Munich', 9000.00, '', TRUE),
(11, 'Jude Bellingham', 4, 'MF', 22, 'Real Madrid', 18000.00, '', TRUE),
(12, 'Bukayo Saka', 4, 'FW', 24, 'Arsenal', 12000.00, '', TRUE),
(13, 'Cristiano Ronaldo', 5, 'FW', 41, 'Al Nassr', 1200.00, '', TRUE),
(14, 'Bruno Fernandes', 5, 'MF', 31, 'Manchester United', 7000.00, '', TRUE),
(15, 'Ruben Dias', 5, 'DF', 29, 'Manchester City', 8000.00, '', TRUE),
(16, 'Pedri', 6, 'MF', 23, 'Barcelona', 8000.00, '', TRUE),
(17, 'Lamine Yamal', 6, 'FW', 18, 'Barcelona', 15000.00, '', TRUE),
(18, 'Rodri', 6, 'MF', 30, 'Manchester City', 11000.00, '', TRUE),
(19, 'Florian Wirtz', 7, 'MF', 23, 'Bayern Munich', 14000.00, '', TRUE),
(20, 'Jamal Musiala', 7, 'MF', 23, 'Bayern Munich', 14000.00, '', TRUE),
(21, 'Kai Havertz', 7, 'FW', 26, 'Arsenal', 7500.00, '', TRUE),
(22, 'Virgil van Dijk', 8, 'DF', 34, 'Liverpool', 2500.00, '', TRUE),
(23, 'Frenkie de Jong', 8, 'MF', 28, 'Barcelona', 6000.00, '', TRUE),
(24, 'Xavi Simons', 8, 'MF', 22, 'RB Leipzig', 8000.00, '', TRUE);

INSERT INTO player_card (card_id, player_id, card_name, card_type, rarity, base_rating, current_rating, current_value, status) VALUES
(1, 1, 'World Cup Icon Messi', 'Epic', 'Legend Gold', 94, 96, 9800.00, 'rising'),
(2, 2, 'Featured Alvarez', 'Featured', 'Gold', 86, 88, 4200.00, 'normal'),
(3, 3, 'Guardian Martinez', 'Highlight', 'Gold', 87, 89, 3900.00, 'rising'),
(4, 4, 'World Cup Featured Mbappe', 'Featured', 'Platinum', 92, 95, 10500.00, 'rising'),
(5, 5, 'Creator Griezmann', 'Highlight', 'Gold', 88, 88, 3600.00, 'normal'),
(6, 6, 'Wall Maignan', 'Standard', 'Silver', 86, 85, 2500.00, 'falling'),
(7, 7, 'Samba Ace Vinicius', 'Featured', 'Platinum', 91, 93, 9300.00, 'rising'),
(8, 8, 'Sharp Rodrygo', 'Highlight', 'Gold', 87, 88, 4100.00, 'normal'),
(9, 9, 'Keeper Alisson', 'Standard', 'Gold', 89, 88, 3400.00, 'falling'),
(10, 10, 'Striker Kane', 'Featured', 'Gold', 90, 91, 7600.00, 'rising'),
(11, 11, 'Midfield Bellingham', 'Epic', 'Platinum', 91, 94, 9900.00, 'rising'),
(12, 12, 'Wing Saka', 'Highlight', 'Gold', 88, 89, 5300.00, 'normal'),
(13, 13, 'Captain Ronaldo', 'Epic', 'Legend Gold', 90, 90, 7200.00, 'normal'),
(14, 14, 'Playmaker Bruno', 'Featured', 'Gold', 88, 89, 5100.00, 'rising'),
(15, 15, 'Defender Dias', 'Standard', 'Gold', 89, 88, 4300.00, 'falling'),
(16, 16, 'Control Pedri', 'Highlight', 'Gold', 87, 88, 4800.00, 'normal'),
(17, 17, 'Wonderkid Yamal', 'Featured', 'Platinum', 86, 91, 8500.00, 'rising'),
(18, 18, 'Anchor Rodri', 'Epic', 'Platinum', 91, 92, 8800.00, 'normal'),
(19, 19, 'Creator Wirtz', 'Featured', 'Gold', 88, 90, 6900.00, 'rising'),
(20, 20, 'Dribbler Musiala', 'Featured', 'Gold', 89, 90, 7000.00, 'rising'),
(21, 21, 'Flexible Havertz', 'Highlight', 'Silver', 85, 84, 2600.00, 'falling'),
(22, 22, 'Captain Van Dijk', 'Epic', 'Gold', 90, 90, 6200.00, 'normal'),
(23, 23, 'Tempo De Jong', 'Highlight', 'Gold', 87, 87, 4200.00, 'normal'),
(24, 24, 'Spark Simons', 'Featured', 'Gold', 86, 88, 4600.00, 'rising');

INSERT INTO worldcup_match (match_id, home_team_id, away_team_id, match_time, stage, home_score, away_score, status) VALUES
(1, 1, 2, '2026-06-12 20:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(2, 3, 4, '2026-06-13 21:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(3, 5, 6, '2026-06-14 19:30:00', 'Group Stage', NULL, NULL, 'upcoming'),
(4, 7, 8, '2026-06-15 22:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(5, 1, 3, '2026-06-18 20:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(6, 2, 4, '2026-06-19 21:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(7, 5, 7, '2026-06-20 19:30:00', 'Group Stage', NULL, NULL, 'upcoming'),
(8, 6, 8, '2026-06-21 22:00:00', 'Group Stage', NULL, NULL, 'upcoming'),
(9, 1, 4, '2026-05-01 20:00:00', 'Warm-up Match', 2, 1, 'finished'),
(10, 2, 3, '2026-05-02 21:00:00', 'Warm-up Match', 1, 1, 'finished'),
(11, 6, 7, '2026-05-03 20:00:00', 'Warm-up Match', 3, 2, 'finished'),
(12, 5, 8, '2026-05-04 20:00:00', 'Warm-up Match', 0, 1, 'finished');

INSERT INTO match_guess (guess_id, user_id, match_id, guess_result, guess_home_score, guess_away_score, is_correct, points_awarded, created_at) VALUES
(1, 1, 1, 'home', 2, 1, NULL, 0, '2026-05-20 10:00:00'),
(2, 2, 1, 'away', 1, 2, NULL, 0, '2026-05-20 10:05:00'),
(3, 3, 2, 'home', 2, 0, NULL, 0, '2026-05-20 11:00:00'),
(4, 4, 3, 'draw', 1, 1, NULL, 0, '2026-05-20 12:00:00'),
(5, 5, 4, 'away', 0, 1, NULL, 0, '2026-05-20 13:00:00'),
(6, 1, 9, 'home', 2, 1, TRUE, 30, '2026-04-28 09:00:00'),
(7, 2, 9, 'draw', 1, 1, FALSE, 0, '2026-04-28 09:10:00'),
(8, 3, 10, 'draw', 1, 1, TRUE, 30, '2026-04-29 09:00:00'),
(9, 4, 10, 'away', 0, 2, FALSE, 0, '2026-04-29 09:20:00'),
(10, 5, 11, 'home', 2, 1, TRUE, 10, '2026-04-30 09:20:00');

INSERT INTO point_record (record_id, user_id, match_id, points_change, reason, created_at) VALUES
(1, 1, 9, 30, '猜中胜负和准确比分', '2026-05-01 22:20:00'),
(2, 3, 10, 30, '猜中胜平负和准确比分', '2026-05-02 23:00:00'),
(3, 5, 11, 10, '猜中胜平负', '2026-05-03 22:40:00'),
(4, 5, 12, 30, '管理员补录演示积分', '2026-05-04 22:30:00');

INSERT INTO card_value_record (card_id, match_id, old_value, new_value, change_reason, changed_at) VALUES
(1, 9, 9000.00, 9800.00, 'goal', '2026-05-01 22:30:00'),
(4, 10, 10000.00, 10500.00, 'goal', '2026-05-02 23:05:00'),
(7, 10, 9600.00, 9300.00, 'poor_performance', '2026-05-02 23:05:00'),
(17, 11, 7800.00, 8500.00, 'assist', '2026-05-03 22:45:00'),
(22, 12, 5900.00, 6200.00, 'clean_sheet', '2026-05-04 22:35:00');
