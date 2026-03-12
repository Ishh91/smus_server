# NGO API (MongoDB + Express)

Backend for the NGO project. Uses the MongoDB connection string in `.env`.

## Setup

```bash
cd server
npm install
```

Copy `.env` and set:

- `MONGODB_URI` – your MongoDB connection string (if the password contains `@`, use `%40`)
- `JWT_SECRET` – any long random string for auth tokens
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – admin login for the Admin panel

## Run

From project root:

```bash
npm run server
```

Or from `server/`:

```bash
npm run dev
```

API runs at `http://localhost:3001`. The Vite app proxies `/api` and `/uploads` to this server when using `npm run dev` in the project root.
