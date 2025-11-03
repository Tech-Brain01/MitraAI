# 🚀 MitraAI - Production DevOps Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Docker Setup](#docker-setup)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Deployment](#deployment)
5. [Monitoring & Logging](#monitoring--logging)
6. [Rollback Strategy](#rollback-strategy)
7. [Security](#security)

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 19 + Vite + Nginx (Production)
- **Backend**: Node.js 20 + Express + MongoDB
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose

### Why No Kubernetes?
For your current scale (Vercel + Render), **Kubernetes is overkill** because:
- ✅ Vercel handles auto-scaling, CDN, and edge deployment automatically
- ✅ Render provides container orchestration, auto-scaling, and health checks
- ✅ Both platforms have built-in monitoring, logging, and rollback capabilities
- ❌ K8s adds complexity: cluster management, networking, storage, cost (~$200+/month)
- ❌ Your app doesn't need multi-region orchestration or microservices yet

**When to consider K8s**: 
- Traffic > 100K requests/day
- Need custom load balancing
- Multi-cloud or hybrid deployment
- Complex microservices architecture

---

## 🐳 Docker Setup

### Build Docker Images

**Backend:**
```bash
cd Backend
docker build -t mitraai-backend:latest .
```

**Frontend:**
```bash
cd Frontend
docker build -t mitraai-frontend:latest .
```

### Run with Docker Compose

**Development:**
```bash
# Create .env file first
cp .env.example .env
# Edit .env with your credentials

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- Frontend: http://localhost:80
- Backend: http://localhost:8080
- MongoDB: localhost:27017

### Docker Commands

```bash
# Build specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Scale services
docker-compose up -d --scale backend=3

# Check health status
docker-compose ps

# Clean up
docker-compose down -v  # Remove volumes
docker system prune -a  # Clean all unused images
```

---

## 🔄 CI/CD Pipeline

### Workflow Overview

```
┌─────────────┐
│   Push/PR   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Lint Code  │ (ESLint)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Run Tests          │
│  - Backend (Jest)   │
│  - Frontend (Build) │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│ Security Scan   │ (Trivy)
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Build Docker Images │
│ - Push to GHCR      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│     Deploy          │
│ - Vercel (Frontend) │
│ - Render (Backend)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│ Create Release  │ (Git Tag)
└─────────────────┘
```

### Automatic Triggers

1. **On Push to `main`**: Full pipeline with deployment
2. **On Push to `develop`**: Tests + Docker build (no deploy)
3. **On Pull Request**: Tests + Security scan only
4. **Weekly (Monday 9 AM)**: Auto-update dependencies

### Required GitHub Secrets

Go to **Settings → Secrets → Actions** and add:

```
VERCEL_TOKEN          # From https://vercel.com/account/tokens
VERCEL_ORG_ID         # From vercel.json or Vercel dashboard
VERCEL_PROJECT_ID     # From vercel.json or Vercel dashboard
RENDER_DEPLOY_HOOK_URL # From Render dashboard → Settings → Deploy Hook
SLACK_WEBHOOK         # (Optional) For notifications
```

### Testing Locally

```bash
# Backend tests
cd Backend
npm install jest supertest @jest/globals --save-dev
npm test

# Frontend build test
cd Frontend
npm run build
npm run preview
```

---

## 🚀 Deployment

### Vercel (Frontend)

**Initial Setup:**
1. Connect GitHub repo to Vercel
2. Set build settings:
   - **Framework**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Environment Variables:**
```
VITE_API_URL=https://mitraai-backend.onrender.com
```

**Deploy manually:**
```bash
cd Frontend
npm install -g vercel
vercel login
vercel --prod
```

### Render (Backend)

**Initial Setup:**
1. Create new **Web Service**
2. Connect GitHub repo
3. Set build settings:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node

**Environment Variables:**
```
NODE_ENV=production
PORT=8080
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret-key>
GEMINI_API_KEY=<your-api-key>
CORS_ORIGIN=https://mitra-ai-rho.vercel.app
```

**Deploy manually:**
- Push to `main` branch
- Or use Deploy Hook: `curl -X POST $RENDER_DEPLOY_HOOK_URL`

### Manual Deployment Commands

```bash
# Deploy frontend to Vercel
cd Frontend
vercel --prod

# Trigger backend deployment on Render
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=xxxxx
```

---

## 📊 Monitoring & Logging

### Health Checks

**Backend Health Endpoint:**
Add to `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

**Check Health:**
```bash
curl https://mitraai-backend.onrender.com/health
```

### Monitoring Tools

1. **Vercel Analytics**: Automatic (https://vercel.com/dashboard/analytics)
2. **Render Metrics**: Automatic (https://dashboard.render.com/metrics)
3. **GitHub Actions**: Check workflow runs

### Logging Best Practices

**Backend (Production Logger):**
```javascript
// utils/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

## ⏮️ Rollback Strategy

### Automatic Rollback

The CI/CD pipeline automatically triggers rollback if deployment fails:
- **Vercel**: Use previous successful deployment
- **Render**: Redeploy previous Docker image

### Manual Rollback

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

**Render:**
1. Go to Dashboard → Your Service
2. Click "Manual Deploy"
3. Select previous commit SHA

**Docker:**
```bash
# Pull previous version
docker pull ghcr.io/yourusername/mitraai-backend:v1.2.0

# Restart with old image
docker-compose down
docker-compose up -d
```

### Version Management

Versions follow **Semantic Versioning** (SemVer):
- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features (v1.1.0)
- **PATCH**: Bug fixes (v1.0.1)

Update version in `package.json`:
```json
{
  "version": "1.2.3"
}
```

---

## 🔒 Security

### Docker Security

✅ **Implemented:**
- Multi-stage builds (smaller attack surface)
- Non-root user (nodejs:1001)
- No secrets in images (use env vars)
- Minimal base images (Alpine Linux)
- Security headers in Nginx
- Health checks for all services

### Secrets Management

**Never commit:**
- `.env` files
- API keys
- Database credentials
- JWT secrets

**Use:**
- GitHub Secrets for CI/CD
- Vercel Environment Variables
- Render Environment Variables

### Security Scanning

**Trivy** scans for:
- Vulnerabilities in dependencies
- Misconfigurations
- Exposed secrets

**Run locally:**
```bash
# Install Trivy
brew install aquasecurity/trivy/trivy

# Scan Docker image
trivy image mitraai-backend:latest

# Scan filesystem
trivy fs .
```

### Best Practices

1. **Regular Updates**: Auto-update dependencies weekly
2. **Audit Dependencies**: `npm audit` in CI pipeline
3. **Rate Limiting**: Already implemented in auth routes
4. **HTTPS Only**: Enforced by Vercel/Render
5. **CORS**: Configure allowed origins
6. **JWT Expiry**: Set reasonable token lifetimes

---

## 🎯 Quick Start Commands

```bash
# 1. Clone and setup
git clone https://github.com/Tech-Brain01/MitraAI.git
cd MitraAI
cp .env.example .env
# Edit .env with your values

# 2. Run with Docker
docker-compose up -d

# 3. Run tests
cd Backend && npm test
cd ../Frontend && npm run build

# 4. Deploy
git add .
git commit -m "feat: new feature"
git push origin main
# CI/CD automatically deploys

# 5. Check deployment
curl https://mitraai-backend.onrender.com/health
open https://mitra-ai-rho.vercel.app
```

---

## 📝 Next Steps

1. **Add Tests**: Expand `server.test.js` with real test cases
2. **Install Dependencies**: 
   ```bash
   cd Backend
   npm install jest supertest @jest/globals winston --save-dev
   ```
3. **Configure GitHub Secrets**: Add Vercel/Render tokens
4. **Enable Workflows**: Push to trigger CI/CD
5. **Monitor Deployments**: Check GitHub Actions tab
6. **Setup Logging**: Implement Winston logger
7. **Add Metrics**: Consider Sentry for error tracking

---

## 🆘 Troubleshooting

### Docker Issues

```bash
# Permission denied
sudo usermod -aG docker $USER
newgrp docker

# Port already in use
docker-compose down
sudo lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Out of disk space
docker system prune -a --volumes
```

### CI/CD Failures

- Check GitHub Actions logs
- Verify all secrets are set
- Ensure tests pass locally first
- Check Docker build logs

### Deployment Issues

- Verify environment variables
- Check service logs in Vercel/Render dashboard
- Test health endpoints
- Verify CORS settings

---

## 📚 Resources

- [Docker Docs](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [SemVer](https://semver.org/)

---

**Built with ❤️ by MitraAI Team**
