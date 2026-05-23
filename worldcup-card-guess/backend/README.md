# Backend

Express API for the database coursework project.

## Commands

```bash
npm.cmd install
npm.cmd run dev
```

## API

- `GET /api/dashboard`
- `GET /api/users`
- `GET /api/teams`
- `GET /api/players`
- `GET /api/cards`
- `GET /api/cards/market`
- `GET /api/matches`
- `POST /api/guesses`
- `POST /api/matches/:matchId/finish`
- `DELETE /api/matches/:matchId`
- `GET /api/ranking`

## Coursework Highlights

- Transaction delete: `src/routes/api.js`, `DELETE /api/matches/:matchId`
- Trigger insert: `sql/04_trigger.sql`, `POST /api/guesses`
- Procedure update: `sql/05_procedure.sql`, `POST /api/matches/:matchId/finish`
- View query: `sql/06_view.sql`, `GET /api/ranking`, `GET /api/cards/market`

## Optional Data Fetch Script

```bash
npm.cmd run fetch-seed
```

If `FOOTBALL_DATA_TOKEN` is set, the script tries to fetch public match data from football-data.org. If it fails, use the stable local SQL seed.
