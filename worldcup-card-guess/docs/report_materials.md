# 数据库工程作业报告材料

## 1. 项目信息

项目名称：世界杯球员卡竞猜与行情管理系统

必备环境：

- MySQL 8.0
- Node.js 18 或更高版本
- npm
- 浏览器

系统主要功能简介：

本系统面向足球爱好者和实况足球玩家，提供国家队、球员、球员卡、世界杯比赛、竞猜、积分结算和球员卡行情查询功能。系统 seed 数据包含 48 支 2026 世界杯 A-L 组球队、192 名代表球员、192 张课程演示球员卡和 72 场小组赛程。系统重点展示数据库事务、触发器、存储过程和视图，满足数据库工程课程设计要求。

数据来源说明：

- 赛程、球队和球员名单参考 FIFA 官方赛程/球队/大名单页面及公开足球资料。
- 球员卡类型、评分、虚拟价值和行情变化为课程演示用模拟数据。
- 项目不批量爬取懂球帝，不使用版权不明确的球员照片。

推荐截图：

- 首页 Dashboard
- 世界杯竞猜页
- 球员卡行情页
- 积分排行榜页
- 赛果录入页
- 比赛管理页

## 2. 系统配置

后台数据库：MySQL 8.0

高级语言：JavaScript / Node.js / React

数据库连接代码位置：

- `backend/src/db.js`

连接串配置位置：

- `backend/.env.example`

连接串说明：

- `DB_HOST`：数据库服务器地址，本机通常为 `localhost`
- `DB_PORT`：数据库端口，MySQL 默认端口为 `3306`
- `DB_USER`：数据库用户名
- `DB_PASSWORD`：数据库密码
- `DB_NAME`：数据库名称，本项目为 `worldcup_card_guess`

## 3. 数据库设计

建表顺序：

1. `national_team`
2. `user_info`
3. `player`
4. `player_card`
5. `worldcup_match`
6. `match_guess`
7. `point_record`
8. `card_value_record`

数据表说明：

| 表名 | 主键 | 外键与参照关系 | 说明 |
| --- | --- | --- | --- |
| `national_team` | `team_id` | 无 | 国家队信息 |
| `user_info` | `user_id` | `favorite_team_id` -> `national_team(team_id)` | 用户信息与总积分 |
| `player` | `player_id` | `team_id` -> `national_team(team_id)` | 国家队球员信息 |
| `player_card` | `card_id` | `player_id` -> `player(player_id)` | 实况足球风格球员卡 |
| `worldcup_match` | `match_id` | `home_team_id`、`away_team_id` -> `national_team(team_id)` | 世界杯比赛 |
| `match_guess` | `guess_id` | `user_id` -> `user_info(user_id)`，`match_id` -> `worldcup_match(match_id)` | 用户竞猜记录 |
| `point_record` | `record_id` | `user_id` -> `user_info(user_id)`，`match_id` -> `worldcup_match(match_id)` | 积分变化记录 |
| `card_value_record` | `value_record_id` | `card_id` -> `player_card(card_id)`，`match_id` -> `worldcup_match(match_id)` | 球员卡行情变化记录 |

建表 SQL 位置：

- `backend/sql/02_create_tables.sql`

推荐截图：

- MySQL 表结构
- 数据库关系图
- `02_create_tables.sql` 中外键定义

## 4. 含有事务应用的删除操作

功能描述：

管理员删除一场世界杯比赛时，同时删除该比赛相关的竞猜记录、积分记录、球员卡行情变化记录，最后删除比赛本身。

涉及表：

- `worldcup_match`
- `match_guess`
- `point_record`
- `card_value_record`

表连接字段：

- `match_guess.match_id = worldcup_match.match_id`
- `point_record.match_id = worldcup_match.match_id`
- `card_value_record.match_id = worldcup_match.match_id`

删除条件字段：

- `worldcup_match.match_id = ?`

后端代码位置：

- `backend/src/routes/api.js`
- 接口：`DELETE /api/matches/:matchId`

SQL 关键语句：

- `START TRANSACTION`
- `DELETE FROM match_guess WHERE match_id = ?`
- `DELETE FROM point_record WHERE match_id = ?`
- `DELETE FROM card_value_record WHERE match_id = ?`
- `DELETE FROM worldcup_match WHERE match_id = ?`
- `COMMIT`
- `ROLLBACK`

前端演示页面：

- 比赛管理页

演示步骤：

1. 打开比赛管理页。
2. 点击某场比赛的“删除比赛”按钮。
3. 确认删除。
4. 页面显示删除成功，并展示关联数据删除数量。

## 5. 触发器控制下的添加操作

功能描述：

用户提交世界杯竞猜时，由数据库触发器检查竞猜是否合法。

触发器功能：

- 比赛必须存在。
- 比赛状态必须是 `upcoming`。
- 当前时间必须早于比赛开始时间。
- 同一用户对同一场比赛只能竞猜一次。
- 预测比分不能为负数。

涉及表：

- `match_guess`
- `worldcup_match`

输入数据规则：

- `user_id` 不能为空。
- `match_id` 不能为空。
- `guess_result` 必须是 `home`、`draw`、`away`。
- `guess_home_score`、`guess_away_score` 不能为负数。

触发器代码位置：

- `backend/sql/04_trigger.sql`

后端接口：

- `POST /api/guesses`

前端演示页面：

- 世界杯竞猜页

正常插入演示：

1. 选择未开始比赛。
2. 选择测试用户。
3. 填写胜平负和预测比分。
4. 点击提交，页面提示成功。

违反触发器演示：

1. 选择已完成比赛提交竞猜。
2. 数据库触发器抛出错误。
3. 前端显示错误信息，例如“比赛不是未开始状态，不能提交竞猜”。

## 6. 存储过程控制下的更新操作

功能描述：

管理员录入比赛结果后，调用存储过程完成比分更新、竞猜结算、积分记录插入和用户总积分更新。

存储过程功能：

- 更新 `worldcup_match.home_score`
- 更新 `worldcup_match.away_score`
- 更新 `worldcup_match.status`
- 更新 `match_guess.is_correct`
- 更新 `match_guess.points_awarded`
- 插入 `point_record`
- 更新 `user_info.total_points`

涉及关系表：

- `worldcup_match`
- `match_guess`
- `point_record`
- `user_info`

表连接字段：

- `match_guess.match_id = worldcup_match.match_id`
- `point_record.user_id = user_info.user_id`
- `point_record.match_id = worldcup_match.match_id`

修改字段和规则：

- 猜中胜平负加 10 分。
- 猜中准确比分额外加 20 分。
- 未猜中加 0 分。
- 已 finished 比赛不能重复结算。

创建存储过程源码位置：

- `backend/sql/05_procedure.sql`

执行存储过程源码位置：

- `backend/src/routes/api.js`
- 接口：`POST /api/matches/:matchId/finish`

前端演示页面：

- 管理员赛果录入页

正常执行演示：

1. 选择 `upcoming` 比赛。
2. 输入主队和客队比分。
3. 点击“录入赛果并结算积分”。
4. 页面展示积分记录，排行榜同步变化。

失败演示：

1. 对已经 `finished` 的比赛再次点击结算。
2. 存储过程报错：“比赛已经完成，不能重复结算”。

## 7. 含有视图的查询操作

视图一：`v_user_ranking`

操作功能描述：

查询用户竞猜排行榜。

视图功能描述：

统计用户竞猜次数、猜中次数、总积分和排名。

涉及关系表：

- `user_info`
- `match_guess`
- `point_record`

查询视图代码位置：

- `backend/src/routes/api.js`
- 接口：`GET /api/ranking`

前端演示页面：

- 积分排行榜页

视图二：`v_card_market`

操作功能描述：

查询世界杯球员卡行情。

视图功能描述：

整合球员、国家队、球员卡、最新行情变化记录。

涉及关系表：

- `player`
- `national_team`
- `player_card`
- `card_value_record`

查询视图代码位置：

- `backend/src/routes/api.js`
- 接口：`GET /api/cards/market`

前端演示页面：

- 球员卡行情页

创建视图代码位置：

- `backend/sql/06_view.sql`

SQL 截图建议：

```sql
SELECT * FROM v_user_ranking;
SELECT * FROM v_card_market;
```
