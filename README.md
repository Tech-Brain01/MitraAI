# MitraAI 🇮🇳

An indigenous, production-ready AI chat platform with JWT-based auth, persistent conversation threads, and a built-in multi-language code sandbox.

[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB)](https://react.dev/) [![Build tool](https://img.shields.io/badge/Build-Vite_7-purple)](https://vitejs.dev/) [![Backend](https://img.shields.io/badge/Backend-Express_4-blue)](https://expressjs.com/) [![DB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/) [![AI](https://img.shields.io/badge/AI-Google%20Gemini-9b59b6)](https://ai.google.dev/)

Live app (frontend): https://mitra-ai-pink.vercel.app

---

## 📋 Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- Project Structure
- Getting Started
- Environment Variables
- API Documentation
- Deployment
- Troubleshooting
- Roadmap

---

## 🎯 Overview

MitraAI is a full-stack conversational AI application demonstrating solid production patterns:

- Modular Express API with authentication and rate limiting
- Clean React 19 app with Context state, router-guarded pages, and Markdown rendering
- Persistent, user-scoped chat threads in MongoDB
- Gemini API integration with resilient model fallback
- Secure, sandboxed code execution (JavaScript, Python, Java)

---

## ✨ Features

- Authentication and profiles
   - Email/username login & registration (JWT tokens)
   - Profile update, password change, and forgot/reset password flow
   - Simple CAPTCHA (upgradeable to reCAPTCHA)
- Chat and threads
   - User-scoped persistent threads with titles and message history
   - Sidebar with recent threads, switch, and delete
   - Typing animation and smooth autoscroll
   - Markdown rendering with syntax highlighting
- Code Sandbox (built-in)
   - Run JavaScript in vm2 sandbox
   - Run Python (via python-shell) and Java (javac/java) using temp files
   - One-click examples, clear output, execution feedback
- Production hardening
   - CORS allowlist with environment override
   - Global and per-endpoint rate limits
   - Health check endpoint for uptime monitors
   - Safe API client with robust JSON handling and auth header injection

---

## 🛠️ Tech Stack

Frontend
- React 19.1.1, Vite 7, React Router 7
- react-markdown, highlight.js, react-hot-toast
- @vercel/analytics, @vercel/speed-insights

Backend
- Node.js 18+, Express 4.19.2 (ESM)
- MongoDB + Mongoose 8.x
- jsonwebtoken, bcryptjs
- express-rate-limit, cors, dotenv
- vm2 (JS sandbox), python-shell (Python), child_process + JDK (Java)
- Google Generative AI (Gemini) REST API

---

## 🏗️ Architecture

```
Browser (React 19 + Vite)
   ├─ Protected routes (/chat, /chat/:id)
   ├─ Context state (prompt, reply, threads, auth)
   └─ apiClient (adds Bearer token, safe JSON)
            │
            ▼
Express API (Node 18)
   ├─ /api/auth/*         (JWT auth & profile)
   ├─ /api/chat, /thread  (AI chat + threads)
   ├─ /api/execute/*      (JS/Python/Java sandbox)
   └─ /health             (readiness probe)
            │
            ├─ MongoDB (User, Thread)
            └─ Gemini REST API (fallback models)
58
```

---

## 📁 Project Structure

```
MitraAI/
├─ Backend/
│  ├─ server.js                  # App bootstrap, CORS, rate limits, routes, /health
│  ├─ routes/
│  │  ├─ auth.js                 # register/login/me/update/reset
│  │  ├─ chat.js                 # /chat, /thread CRUD (auth required)
│  │  └─ execute.js              # /execute/javascript|python|java
│  ├─ models/
│  │  ├─ User.js                 # username/email/password, plan, tokens
│  │  └─ Thread.js               # user-scoped messages with indexes
│  ├─ middleware/authMiddleware.js
│  ├─ utils/geminiai.js          # Gemini REST client with model fallback
│  └─ package.json               # scripts: dev/start
│
├─ Frontend/
│  ├─ src/
│  │  ├─ apiClient.js            # base URL + Bearer token + safe JSON
│  │  ├─ App.jsx                 # routes/guards, Context provider
│  │  ├─ Sidebar.jsx             # threads list, create/delete
│  │  ├─ Chatwindow.jsx          # input, typing, settings, sandbox toggle
│  │  ├─ Chat.jsx                # markdown + code blocks
│  │  ├─ CodeSandbox.jsx         # JS/Python/Java execution UI
│  │  ├─ Login.jsx / Register.jsx / ForgotPassword.jsx
│  │  └─ Settings.jsx / UpgradePlan.jsx
│  ├─ vite.config.js             # dev proxy /api → 8080
│  └─ package.json               # dev/build/preview
└─ README.md
```

---

## 🚀 Getting Started

Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Google AI Studio API key (Gemini)


Install
1) Clone and install
```
git clone https://github.com/Tech-Brain01/MitraAI.git
cd MitraAI
cd Backend && npm install
cd ../Frontend && npm install
```

2) Configure environment
- Backend: create `Backend/.env` (see next section)
- Frontend: optionally create `Frontend/.env` with `VITE_API_URL`

Run locally
- Backend
```
cd Backend
npm run dev
```
- Frontend (in a new terminal)
```
cd Frontend
npm run dev
```
Open http://localhost:5173

---

## 🔌 API Documentation

Base URLs
- Local: http://localhost:8080/api
- Production: set via `VITE_API_URL`

Auth (public unless noted)
- POST /api/auth/register
   - body: { username, email, password, captcha }
   - returns: { success, token, user }
- POST /api/auth/login
   - body: { identifier, password, captcha }
   - returns: { success, token, user }
- POST /api/auth/forgot-password
   - body: { email }
   - returns: { success, message }
- POST /api/auth/reset-password
   - body: { token, newPassword }
   - returns: { success, message }
- GET /api/auth/me (Bearer token)
   - header: Authorization: Bearer <JWT>
   - returns: { success, user }
- PUT /api/auth/update-profile (Bearer token)
   - header: Authorization: Bearer <JWT>
   - body: { username?, email?, currentPassword?, newPassword?, profilePicture? }
   - returns: { success, user }

Chat & Threads (Bearer token required)
- POST /api/chat
   - body: { threadId: string, message: string }
   - returns: { reply: string }
- GET /api/thread
   - returns: Thread[] (most recent first)
- GET /api/thread/:threadId
   - returns: Thread
- DELETE /api/thread/:threadId
   - returns: { success }

Code Execution (Bearer token required)
- POST /api/execute/javascript
   - body: { code: string }
   - returns: { success, output, result?, executionTime }
- POST /api/execute/python
   - body: { code: string }
   - returns: { success, output, executionTime }
- POST /api/execute/java
   - body: { code: string with a public class (default Main) }
   - returns: { success, output, executionTime }

Health
- GET /health → { status, uptime, timestamp, environment }

Security & Limits
- Auth: Send `Authorization: Bearer <JWT>` for all private endpoints.
- Global rate limit: 100 req / 15 min per IP.
- Chat rate limit: 20 messages / minute per IP.
- CORS: allowlist is configured in `server.js` (include your production origin).

---

## 🌐 Deployment

Recommended
- Frontend: Vercel (root directory: `Frontend`)
- Backend: Render/Heroku/Any Node host (root directory: `Backend`)

Frontend
1) Set `VITE_API_URL` to your deployed backend `/api` URL
2) Build and deploy `Frontend`

Backend
1) Provision a MongoDB (Atlas)
2) Set env vars: MONGO_URI, GOOGLE_API_KEY, JWT_SECRET, FRONTEND_URL, PORT
3) Start command: `npm start` in `Backend`

---

## 🧰 Troubleshooting

- 401 Unauthorized → Missing/expired JWT; ensure `Authorization: Bearer <token>` is sent.
- 429 Too Many Requests → You hit rate limits; wait and retry.
- CORS error in browser → Add your frontend origin to `allowedOrigins` in `server.js`.
- MongoDB connection error → Check `MONGO_URI` and network access (IP whitelist in Atlas).
- Gemini API error → Verify `GOOGLE_API_KEY`, quotas, and model names in `utils/geminiai.js`.
- Code Sandbox Python/Java fail → Ensure `python`, `javac`, and `java` are installed and in PATH.

---

## 🗺️ Roadmap (high-level)

- Streaming responses (SSE) with stop/regenerate
- Thread rename/pin and search
- RAG: uploads with citations
- OAuth providers, quotas, and billing
- Observability and OpenAPI docs
- PWA, i18n (Hindi/Hinglish), voice I/O

---

## 👨‍💻 Author

Amrendera Singh Tomar
- Email: tomar.amrendera@outlook.com
- GitHub: https://github.com/Tech-Brain01

— Built with 💙 for India
