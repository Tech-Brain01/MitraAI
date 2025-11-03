# 🤝 Contributing to MitraAI

Thank you for considering contributing to MitraAI! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Testing](#testing)
4. [Pull Request Process](#pull-request-process)
5. [Code Style](#code-style)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/Tech-Brain01/MitraAI.git
cd MitraAI

# Install dependencies
cd Backend && npm install
cd ../Frontend && npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials

# Start development servers
cd Backend && npm run dev    # Terminal 1
cd Frontend && npm run dev   # Terminal 2
```

---

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/` - New features (e.g., `feature/add-voice-chat`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-api`)

### Workflow Steps

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Follow the code style guidelines
   - Add tests if applicable

3. **Test your changes**
   ```bash
   cd Backend && npm test
   cd Frontend && npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Wait for review

---

## 🧪 Testing

### Backend Tests
```bash
cd Backend
npm test
```

Tests check:
- Health endpoint
- Environment configuration
- API routes

### Frontend Build
```bash
cd Frontend
npm run build
npm run preview
```

---

## 📝 Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Follow Template**: Fill out the PR template completely
3. **Pass CI/CD**: Ensure all GitHub Actions checks pass
4. **Get Review**: At least one maintainer must approve
5. **Merge**: Maintainer will merge your PR

### PR Title Format
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

Examples:
- `feat: add voice chat feature`
- `fix: resolve login authentication bug`
- `docs: update API documentation`

---

## 🎨 Code Style

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Use `const` and `let`, avoid `var`
- Use meaningful variable names
- Add comments for complex logic

### File Structure
```
Backend/
├── models/       # Database models
├── routes/       # API routes
├── utils/        # Helper functions
└── server.js     # Main server file

Frontend/
├── src/
│   ├── components/  # React components
│   ├── assets/      # Images, fonts
│   └── App.jsx      # Main app component
```

### Commit Message Guidelines
```
<type>: <subject>

<body>

<footer>
```

Example:
```
feat: add model selector dropdown

- Created ModelSelector component
- Added 6 Indian AI agent options
- Integrated with Sidebar

Closes #123
```

---

## 🐛 Reporting Bugs

Use the GitHub issue templates:
1. Go to Issues → New Issue
2. Select "Bug Report"
3. Fill out the template
4. Submit

---

## 💡 Suggesting Features

1. Check existing issues first
2. Create a new issue with "Feature Request" template
3. Describe the feature clearly
4. Explain the use case

---

## 📞 Questions?

- Open a Discussion on GitHub
- Comment on related issues
- Contact maintainers

---

## 🙏 Thank You!

Every contribution helps make MitraAI better. We appreciate your time and effort! ❤️
