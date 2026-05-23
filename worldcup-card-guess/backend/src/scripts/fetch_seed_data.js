import dotenv from "dotenv";

dotenv.config();

const token = process.env.FOOTBALL_DATA_TOKEN;

async function main() {
  if (!token) {
    console.log("未配置 FOOTBALL_DATA_TOKEN。请使用 backend/sql/03_insert_seed_data.sql 初始化真实化本地演示数据。");
    console.log("本地 seed 已包含 16 支 2026 世界杯 A-D 组球队、96 名代表球员、96 张模拟球员卡和 24 场小组赛程。");
    return;
  }

  try {
    const response = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: { "X-Auth-Token": token }
    });

    if (!response.ok) {
      throw new Error(`football-data.org 返回 HTTP ${response.status}`);
    }

    const data = await response.json();
    const matches = (data.matches || []).slice(0, 32).map((match) => ({
      utcDate: match.utcDate,
      stage: match.stage,
      homeTeam: match.homeTeam?.name,
      awayTeam: match.awayTeam?.name,
      status: match.status
    }));

    console.log("可参考的公开赛程数据如下。最终课堂演示仍建议使用本地 SQL seed：");
    console.log(JSON.stringify(matches, null, 2));
  } catch (error) {
    console.log("获取公开数据失败，请使用本地真实化 SQL seed。原因：");
    console.log(error.message);
  }
}

main();
