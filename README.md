# MitraAI 🇮🇳

> **A production-grade, indigenous AI chat platform** built with modern web technologies, featuring persistent conversation threads, streaming-ready architecture, and a uniquely Indian design language.

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://mitra-ai-rho.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Express-blue)](https://expressjs.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Gemini%202.5-purple)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Design Philosophy](#-design-philosophy)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 Overview

**MitraAI** is a full-stack conversational AI platform designed to showcase production-ready patterns for building intelligent chat applications. The project emphasizes:

- **Clean Architecture**: Separation of concerns with modular backend routes, reusable frontend components, and centralized state management
- **Robust Error Handling**: Graceful fallbacks, safe JSON parsing, and clear user feedback
- **Indigenous Identity**: Custom design system inspired by Indian colors, typography (Hind/Mukta fonts), and cultural motifs
- **Scalability**: Ready for streaming responses (SSE), RAG integration, and multi-user auth

This is not just a demo—it's a foundation for building enterprise-grade AI products.

---

## ✨ Key Features

### Core Functionality
- **💬 Persistent Chat Threads**: Each conversation is stored with a unique thread ID; messages persist across sessions
- **🤖 AI-Powered Responses**: Powered by Google Gemini 2.5 Flash with intelligent fallback to multiple models
- **📜 Thread History**: Sidebar lists all conversations sorted by most recent; click to resume any thread
- **🗑️ Thread Management**: Delete threads with optimistic UI updates
- **⚡ Real-Time Typing**: Visual feedback with animated typing effect for assistant responses
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Technical Highlights
- **🛡️ Type-Safe API Client**: Centralized `apiFetch` wrapper with safe JSON parsing and error boundaries
- **🔄 Automatic Model Fallback**: If the primary model fails, gracefully switches to backup models without user disruption
- **🎨 Indigenous Design System**: Custom CSS tokens for tricolour-inspired palette (saffron, Ashoka blue, Indian green)
- **♿ Accessibility**: Keyboard navigation, semantic HTML, ARIA labels, focus indicators
- **🌐 CORS-Ready**: Pre-configured for local dev and production deployments (Vercel/Render)

### UX Polish
- **Smooth Scrolling**: ChatGPT-style auto-scroll to bottom on new messages
- **Hover States**: Subtle interaction feedback (thread highlights, delete icon reveals)
- **Loading States**: Spinner during API calls; prevents duplicate requests

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React 19** | UI library with concurrent features | `^19.1.1` |
| **Vite** | Fast build tool and dev server | `^7.1.2` |
| **React Context API** | Global state management | Built-in |
| **React Markdown** | Render assistant responses with Markdown | `^10.1.0` |
| **Highlight.js** | Syntax highlighting for code blocks | `^11.11.1` |
| **UUID** | Generate unique thread IDs | `^11.1.0` |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript runtime (ESM modules) | `18.x+` |
| **Express 5** | Fast, minimalist web framework | `^5.1.0` |
| **MongoDB + Mongoose** | NoSQL database with ODM | `^8.17.2` |
| **Google Generative AI SDK** | Interface to Gemini models | `^0.24.1` |
| **dotenv** | Environment variable management | `^17.2.1` |
| **CORS** | Cross-origin request handling | `^2.8.5` |

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          React Frontend (Vite dev server)           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │  Sidebar   │  │ Chatwindow │  │   Chat     │    │   │
│  │  │  (threads) │  │  (input)   │  │ (messages) │    │   │
│  │  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘    │   │
│  │        └────────────────┼────────────────┘          │   │
│  │                         │                            │   │
│  │                   MyContext.Provider                 │   │
│  │          (prompt, reply, threads, currThreadId)     │   │
│  │                         │                            │   │
│  │                    apiFetch                          │   │
│  │              (centralized API client)                │   │
│  └─────────────────────────┼───────────────────────────┘   │
└────────────────────────────┼───────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               Express Backend (Node.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  /api Routes                         │  │
│  │  POST   /api/chat          (send message)           │  │
│  │  GET    /api/thread        (list all threads)       │  │
│  │  GET    /api/thread/:id    (get thread by ID)       │  │
│  │  DELETE /api/thread/:id    (delete thread)          │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │                                        │
│         ┌──────────▼───────────┐      ┌─────────────────┐ │
│         │  MongoDB (Mongoose)  │      │ Gemini AI API   │ │
│         │  - Thread schema     │      │ (multi-model    │ │
│         │  - Message schema    │      │  fallback)      │ │
│         └──────────────────────┘      └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
         MongoDB Atlas (Cloud Database)
```

---

## 📁 Project Structure

```
MitraAI/
├── Backend/
│   ├── models/
│   │   └── Thread.js              # Mongoose schema
│   ├── routes/
│   │   └── chat.js                # Express routes
│   ├── utils/
│   │   └── geminiai.js            # Gemini API client
│   ├── .env                       # Environment variables
│   ├── server.js                  # Entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── apiClient.js           # Fetch wrapper
│   │   ├── App.jsx                # Root component
│   │   ├── MyContext.jsx          # React Context
│   │   ├── Sidebar.jsx            # Thread list
│   │   ├── Chatwindow.jsx         # Input box
│   │   ├── Chat.jsx               # Message renderer
│   │   └── index.css              # Design tokens
│   ├── vite.config.js             # Vite dev proxy
│   └── package.json
│
└── README.md                      # This file
```

---

## 🔌 API Documentation

### Base URL
- **Local**: `http://localhost:8080/api`
- **Production**: Set via `VITE_API_URL`

### Endpoints

#### POST `/api/chat`
Send a message and get AI response.

**Request**:
```json
{
  "threadId": "uuid-string",
  "message": "Hello"
}
```

**Response**:
```json
{
  "reply": "Hi there! How can I help?"
}
```

#### GET `/api/thread`
List all threads (sorted by most recent).

#### GET `/api/thread/:threadId`
Get single thread with messages.

#### DELETE `/api/thread/:threadId`
Delete a thread permanently.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tech-Brain01/MitraAI.git
   cd MitraAI
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running Locally

#### Backend

1. Create `Backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/...
   GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
   FRONTEND_URL=http://localhost:5173
   ```

2. Start server:
   ```bash
   cd Backend
   npm run dev
   ```

#### Frontend

1. Start dev server:
   ```bash
   cd Frontend
   npm run dev
   ```

2. Open `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)
- `MONGO_URI` – MongoDB connection string
- `GOOGLE_API_KEY` – Google AI Studio API key
- `FRONTEND_URL` – CORS allowed origin

### Frontend (Vercel env vars)
- `VITE_API_URL` – Backend API URL (e.g., `https://backend.onrender.com/api`)

---

## 🌍 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set Root Directory: `Frontend`
3. Add env var: `VITE_API_URL`
4. Deploy

### Backend (Render)
1. Create Web Service
2. Build: `cd Backend && npm install`
3. Start: `cd Backend && npm start`
4. Add env vars: `MONGO_URI`, `GOOGLE_API_KEY`, `FRONTEND_URL`

---

## 🎨 Design Philosophy

### Indigenous Indian Identity
- **Tricolour Accent**: Saffron, white, Indian green top bar
- **Ashoka Blue**: Primary interactive elements
- **Typography**: Hind/Mukta fonts (Devanagari + Latin)
- **Jaali Motifs**: Subtle geometric gradients

### Color Palette
```css
--saffron: #ff671f;
--indian-green: #046a38;
--ashoka-blue: #1a5e9a;
```

---

## 🗺️ Future Roadmap

### Phase 1: Core Enhancements
- [ ] Server-Sent Events (SSE) streaming
- [ ] Stop/Regenerate buttons
- [ ] Thread rename & pin
- [ ] Search threads
- [ ] Prompt presets

### Phase 2: Intelligence
- [ ] RAG (PDF uploads with citations)
- [ ] Multi-model routing
- [ ] Function calling (tools)

### Phase 3: Production
- [ ] User authentication (Clerk/Auth0)
- [ ] Usage quotas & Stripe billing
- [ ] Rate limiting & observability
- [ ] OpenAPI docs & tests

### Phase 4: Scale
- [ ] PWA (installable app)
- [ ] i18n (Hindi/Hinglish)
- [ ] Voice I/O
- [ ] Collaborative threads

---

## 👨‍💻 Author

**Amrendera Singh Tomar**  
📧 tomar.amrendera@outlook.com  
🔗 [GitHub: Tech-Brain01](https://github.com/Tech-Brain01)

---

## 📊 Project Stats

- **Lines of Code**: ~2,500
- **Components**: 5 React components
- **API Routes**: 5 endpoints
- **Bundle Size**: ~150 KB gzipped
- **Build Time**: ~3 seconds

---

**Built with 💙 for India | Made for recruiters who value depth**

*Last updated: November 2, 2025*
