import dotenv from "dotenv";

dotenv.config();

const token = process.env.FOOTBALL_DATA_TOKEN;

async function main() {
  if (!token) {
    console.log("未配置 FOOTBALL_DATA_TOKEN。请使用 backend/sql/03_insert_seed_data.sql 初始化稳定演示数据。");
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
    const matches = (data.matches || []).slice(0, 12).map((match) => ({
      utcDate: match.utcDate,
      stage: match.stage,
      homeTeam: match.homeTeam?.name,
      awayTeam: match.awayTeam?.name,
      status: match.status
    }));

    console.log("可参考的公开赛程数据如下。课程演示仍建议使用本地 SQL seed：");
    console.log(JSON.stringify(matches, null, 2));
  } catch (error) {
    console.log("获取公开数据失败，请使用本地 SQL seed。原因：");
    console.log(error.message);
  }
}

main();
