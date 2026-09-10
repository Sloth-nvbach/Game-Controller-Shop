# Game Controller Shop

A website dedicated to selling game controllers, built as a small learning project.

## Tech Stack

- **M**ongoDB — database
- **E**xpress.js — backend framework
- **R**eact.js — frontend UI
- **N**ode.js — runtime

## Structure

```
Game-Controller-Shop/
├── server/          # Backend (Node.js + Express + MongoDB) — MVC pattern
│   └── src/
│       ├── config/      # DB connection, environment
│       ├── models/      # Mongoose models (data layer)
│       ├── controllers/ # Request handlers (logic)
│       ├── routes/      # Route definitions
│       └── ...
├── client/          # Frontend (React + Vite)
└── package.json     # Monorepo root (scripts to run both)
```

## Getting Started

```bash
# 1. Install all dependencies (root + server + client)
npm install
npm run install:all

# 2. Set up environment variables (see server/.env.example)

# 3. Run both server and client
npm run dev
```

- Server: http://localhost:5000
- Client: http://localhost:5173