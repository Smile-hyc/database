import express from "express";
import { pool } from "../db.js";

const router = express.Router();

const ok = (res, data, message) => res.json({ success: true, data, ...(message ? { message } : {}) });
const fail = (res, error, status = 400) => {
  const message = error?.sqlMessage || error?.message || "操作失败";
  return res.status(status).json({ success: false, message });
};

router.get("/dashboard", async (_req, res) => {
  try {
    const [[teamCount], [cardCount], [openGuessCount], [topCards], [upcomingMatches], [currentUser]] =
      await Promise.all([
        pool.query("SELECT COUNT(*) AS total FROM national_team"),
        pool.query("SELECT COUNT(*) AS total FROM player_card"),
        pool.query("SELECT COUNT(*) AS total FROM worldcup_match WHERE status = 'upcoming'"),
        pool.query(`
          SELECT c.card_id, c.card_name, c.card_type, c.rarity, c.current_rating, c.current_value,
                 c.status, p.player_name, p.position, t.team_name, t.country_code
          FROM player_card c
          JOIN player p ON c.player_id = p.player_id
          JOIN national_team t ON p.team_id = t.team_id
          ORDER BY c.current_value DESC, c.current_rating DESC
          LIMIT 6
        `),
        pool.query(`
          SELECT m.*, ht.team_name AS home_team, ht.country_code AS home_code, ht.flag_url AS home_flag,
                 at.team_name AS away_team, at.country_code AS away_code, at.flag_url AS away_flag
          FROM worldcup_match m
          JOIN national_team ht ON m.home_team_id = ht.team_id
          JOIN national_team at ON m.away_team_id = at.team_id
          WHERE m.status = 'upcoming'
          ORDER BY m.match_time ASC
          LIMIT 5
        `),
        pool.query("SELECT user_id, nickname, total_points FROM user_info ORDER BY total_points DESC LIMIT 1")
      ]);

    ok(res, {
      stats: {
        team_count: teamCount[0].total,
        card_count: cardCount[0].total,
        open_guess_count: openGuessCount[0].total,
        top_user_points: currentUser[0]?.total_points || 0
      },
      top_cards: topCards,
      upcoming_matches: upcomingMatches,
      current_user: currentUser[0] || null
    });
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/users", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT user_id, username, nickname, total_points FROM user_info ORDER BY user_id");
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/teams", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM national_team ORDER BY fifa_rank IS NULL, fifa_rank, team_name");
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/players", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.team_name, t.country_code, t.flag_url
      FROM player p
      JOIN national_team t ON p.team_id = t.team_id
      ORDER BY t.team_name, p.position, p.player_name
    `);
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/players/:playerId", async (req, res) => {
  const playerId = Number(req.params.playerId);
  if (!Number.isInteger(playerId)) {
    return fail(res, new Error("球员编号不合法"));
  }

  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.team_name, t.country_code, t.flag_url, c.card_id, c.card_name,
             c.card_type, c.rarity, c.base_rating, c.current_rating, c.current_value, c.status AS card_status
      FROM player p
      JOIN national_team t ON p.team_id = t.team_id
      LEFT JOIN player_card c ON p.player_id = c.player_id
      WHERE p.player_id = ?
      LIMIT 1
    `, [playerId]);

    if (!rows[0]) {
      return fail(res, new Error("球员不存在"), 404);
    }

    ok(res, rows[0]);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/squads/hot", async (_req, res) => {
  const hotTeams = ["Brazil", "Argentina", "France", "England", "Portugal", "Spain", "Germany", "Netherlands"];
  const teamOrder = hotTeams.map((team, index) => `WHEN '${team}' THEN ${index + 1}`).join(" ");
  try {
    const [rows] = await pool.query(`
      SELECT t.team_id, t.team_name, t.country_code, t.flag_url, t.fifa_rank,
             p.player_id, p.player_name, p.position, p.age, p.club, p.market_value,
             c.card_id, c.card_type, c.rarity, c.current_rating, c.current_value, c.status AS card_status
      FROM national_team t
      JOIN player p ON t.team_id = p.team_id
      LEFT JOIN player_card c ON p.player_id = c.player_id
      WHERE t.team_name IN (?)
      ORDER BY CASE t.team_name ${teamOrder} ELSE 99 END,
               FIELD(p.position, 'GK', 'DF', 'MF', 'FW'), p.market_value DESC, p.player_name
    `, [hotTeams]);

    const teams = [];
    const teamMap = new Map();
    for (const row of rows) {
      if (!teamMap.has(row.team_id)) {
        const team = {
          team_id: row.team_id,
          team_name: row.team_name,
          country_code: row.country_code,
          flag_url: row.flag_url,
          fifa_rank: row.fifa_rank,
          positions: { GK: [], DF: [], MF: [], FW: [] }
        };
        teamMap.set(row.team_id, team);
        teams.push(team);
      }
      teamMap.get(row.team_id).positions[row.position].push({
        player_id: row.player_id,
        player_name: row.player_name,
        position: row.position,
        age: row.age,
        club: row.club,
        market_value: row.market_value,
        card_id: row.card_id,
        card_type: row.card_type,
        rarity: row.rarity,
        current_rating: row.current_rating,
        current_value: row.current_value,
        card_status: row.card_status
      });
    }

    ok(res, teams);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/cards", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, p.player_name, p.position, p.club, p.market_value, p.photo_url,
             t.team_name, t.country_code, t.flag_url
      FROM player_card c
      JOIN player p ON c.player_id = p.player_id
      JOIN national_team t ON p.team_id = t.team_id
      ORDER BY c.current_value DESC, c.current_rating DESC
    `);
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/cards/market", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM v_card_market ORDER BY current_value DESC, current_rating DESC");
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.get("/matches", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, ht.team_name AS home_team, ht.country_code AS home_code, ht.flag_url AS home_flag,
             at.team_name AS away_team, at.country_code AS away_code, at.flag_url AS away_flag
      FROM worldcup_match m
      JOIN national_team ht ON m.home_team_id = ht.team_id
      JOIN national_team at ON m.away_team_id = at.team_id
      ORDER BY m.match_time ASC, m.match_id ASC
    `);
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

router.post("/guesses", async (req, res) => {
  const { user_id, match_id, guess_result, guess_home_score, guess_away_score } = req.body;
  if (!user_id || !match_id || !guess_result || guess_home_score === undefined || guess_away_score === undefined) {
    return fail(res, new Error("请完整填写用户、比赛、竞猜结果和预测比分"));
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO match_guess
       (user_id, match_id, guess_result, guess_home_score, guess_away_score)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, match_id, guess_result, guess_home_score, guess_away_score]
    );
    ok(res, { guess_id: result.insertId }, "竞猜提交成功");
  } catch (error) {
    fail(res, error);
  }
});

router.post("/matches/:matchId/finish", async (req, res) => {
  const matchId = Number(req.params.matchId);
  const { home_score, away_score } = req.body;
  if (!Number.isInteger(matchId) || home_score === undefined || away_score === undefined) {
    return fail(res, new Error("请提供比赛编号和双方比分"));
  }

  try {
    await pool.query("CALL sp_finish_match_and_settle_points(?, ?, ?)", [matchId, home_score, away_score]);
    const [records] = await pool.query(
      `SELECT pr.*, u.nickname
       FROM point_record pr
       JOIN user_info u ON pr.user_id = u.user_id
       WHERE pr.match_id = ?
       ORDER BY pr.created_at DESC, pr.record_id DESC`,
      [matchId]
    );
    ok(res, { point_records: records }, "赛果已录入，积分已结算");
  } catch (error) {
    fail(res, error);
  }
});

router.delete("/matches/:matchId", async (req, res) => {
  const matchId = Number(req.params.matchId);
  if (!Number.isInteger(matchId)) {
    return fail(res, new Error("比赛编号不合法"));
  }

  const connection = await pool.getConnection();
  try {
    await connection.query("START TRANSACTION");
    const [[match]] = await connection.query("SELECT match_id FROM worldcup_match WHERE match_id = ? FOR UPDATE", [matchId]);
    if (!match) {
      throw new Error("比赛不存在，无法删除");
    }

    const [deletedGuesses] = await connection.query("DELETE FROM match_guess WHERE match_id = ?", [matchId]);
    const [deletedPoints] = await connection.query("DELETE FROM point_record WHERE match_id = ?", [matchId]);
    const [deletedValues] = await connection.query("DELETE FROM card_value_record WHERE match_id = ?", [matchId]);
    const [deletedMatch] = await connection.query("DELETE FROM worldcup_match WHERE match_id = ?", [matchId]);

    await connection.query("COMMIT");
    ok(res, {
      deleted_match: deletedMatch.affectedRows,
      deleted_guesses: deletedGuesses.affectedRows,
      deleted_point_records: deletedPoints.affectedRows,
      deleted_card_value_records: deletedValues.affectedRows
    }, "比赛及关联数据已删除");
  } catch (error) {
    await connection.query("ROLLBACK");
    fail(res, error);
  } finally {
    connection.release();
  }
});

router.get("/ranking", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM v_user_ranking ORDER BY rank_no, total_points DESC");
    ok(res, rows);
  } catch (error) {
    fail(res, error, 500);
  }
});

export default router;
