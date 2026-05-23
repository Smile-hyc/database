# 世界杯球员卡竞猜与行情管理系统

这是一个面向数据库工程课程设计的全栈项目，主题结合世界杯竞猜、实况足球风格球员卡、积分排行榜和卡片行情管理。项目重点展示 MySQL 的事务、触发器、存储过程和视图。

## 技术栈

- 前端：React + Vite + Tailwind CSS + lucide-react
- 后端：Node.js + Express
- 数据库：MySQL 8.0
- 数据库连接：mysql2/promise

## 项目结构

```text
worldcup-card-guess/
├── backend/
│   ├── src/
│   └── sql/
├── frontend/
│   └── src/
├── docs/
│   └── report_materials.md
└── README.md
```

## 数据库初始化

请先安装 MySQL 8.0，并确认 `mysql` 命令可用。按顺序执行：

```bash
mysql -u root -p < backend/sql/01_create_database.sql
mysql -u root -p worldcup_card_guess < backend/sql/02_create_tables.sql
mysql -u root -p worldcup_card_guess < backend/sql/03_insert_seed_data.sql
mysql -u root -p worldcup_card_guess < backend/sql/04_trigger.sql
mysql -u root -p worldcup_card_guess < backend/sql/05_procedure.sql
mysql -u root -p worldcup_card_guess < backend/sql/06_view.sql
```

`backend/sql/07_demo_queries.sql` 是报告截图和课堂演示用 SQL，不建议直接整文件执行，因为里面包含成功和失败演示语句。

## 后端运行

```bash
cd backend
npm.cmd install
copy .env.example .env
npm.cmd run dev
```

然后根据自己的 MySQL 修改 `.env`：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=worldcup_card_guess
PORT=3001
```

连接串说明：

- `DB_HOST`：数据库服务器地址，本机通常是 `localhost`
- `DB_PORT`：MySQL 端口，默认 `3306`
- `DB_USER`：数据库用户名，例如 `root`
- `DB_PASSWORD`：数据库密码
- `DB_NAME`：要连接的数据库名，本项目为 `worldcup_card_guess`

## 前端运行

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

默认前端会请求 `http://localhost:3001/api`。如果后端端口不同，可在前端创建 `.env`：

```env
VITE_API_BASE=http://localhost:3001/api
```

## 核心演示

- 事务删除比赛：进入“比赛管理页”，点击删除比赛。
- 触发器阻止非法竞猜：进入“世界杯竞猜页”，对 finished 比赛提交竞猜会报错。
- 存储过程结算积分：进入“赛果录入页”，对 upcoming 比赛录入比分。
- 视图查询：进入“积分排行榜页”和“球员卡行情页”。

## 数据说明

本地 seed 数据已经扩充为 2026 世界杯 48 队真实化演示数据：

- 国家队：48 支 2026 世界杯 A-L 组球队。
- 球员：每队 4 名代表球员，共 192 名。
- 球员卡：每名球员自动生成 1 张世界杯风格球员卡，共 192 张。
- 赛程：采用公开赛程中的 2026 世界杯 Match 1-72 小组赛对阵，时间按北京时间存储。
- 课程演示：额外保留 2 场已完赛热身赛，用于触发器失败、历史积分和行情变化演示。

赛程、球队和球员名单参考 FIFA 官方赛程/球队/大名单页面及公开足球资料；其中小组赛对阵按公开赛程的 Match 1-72 顺序整理，时间统一转换为北京时间展示。球员卡类型、评分、虚拟价值、行情变化为课程演示用模拟数据。项目不爬取 eFootball 官方或第三方球员卡图片，不绕过登录或反爬限制。

参考来源：

- FIFA World Cup 2026 schedule: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
- FIFA World Cup 2026 teams: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams
- FIFA squad announcement hub: https://www.fifa.com/en/articles/all-world-cup-squad-announcements
- football-data.org API documentation: https://www.football-data.org/documentation/api
