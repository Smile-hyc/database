CREATE OR REPLACE VIEW v_user_ranking AS
SELECT
  u.user_id,
  u.nickname,
  COUNT(DISTINCT mg.guess_id) AS guess_count,
  SUM(CASE WHEN mg.is_correct = TRUE THEN 1 ELSE 0 END) AS correct_count,
  u.total_points,
  DENSE_RANK() OVER (ORDER BY u.total_points DESC) AS rank_no
FROM user_info u
LEFT JOIN match_guess mg ON u.user_id = mg.user_id
LEFT JOIN point_record pr ON u.user_id = pr.user_id
GROUP BY u.user_id, u.nickname, u.total_points;

CREATE OR REPLACE VIEW v_card_market AS
SELECT
  c.card_id,
  p.player_name,
  t.team_name,
  t.country_code,
  t.flag_url,
  p.position,
  p.club,
  c.card_type,
  c.rarity,
  c.base_rating,
  c.current_rating,
  p.market_value,
  c.current_value,
  c.status,
  latest.change_reason AS latest_change_reason,
  latest.changed_at AS latest_changed_at
FROM player_card c
JOIN player p ON c.player_id = p.player_id
JOIN national_team t ON p.team_id = t.team_id
LEFT JOIN (
  SELECT r1.card_id, r1.change_reason, r1.changed_at
  FROM card_value_record r1
  JOIN (
    SELECT card_id, MAX(changed_at) AS max_changed_at
    FROM card_value_record
    GROUP BY card_id
  ) r2 ON r1.card_id = r2.card_id AND r1.changed_at = r2.max_changed_at
) latest ON c.card_id = latest.card_id;
