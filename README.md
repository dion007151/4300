# 4300

**4300** is pronounced **"For Free"**.

Tagline: **Everything. For Free.**

This repository is a full-stack foundation for an all-in-one AI productivity platform. It is organized as a modular tool platform so new suites can be added without changing the core dashboard, search, authentication, file, or API architecture.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI
- Database: PostgreSQL
- Storage: S3-compatible object storage
- Auth: Auth.js or Clerk ready
- Deployment: Docker Compose

## Structure

```text
apps/
  web/      Next.js dashboard and tool experience
  api/      FastAPI service and plugin registry
packages/
  shared/   Shared product constants and tool metadata
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev:web
```

Run the API after installing Python dependencies from `apps/api/pyproject.toml`:

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

Or use Docker:

```bash
docker compose up --build
```

## Product Foundation

The frontend includes:

- Responsive dashboard with sidebar navigation
- Universal search over tools, files, notes, templates, resumes, and AI history
- Dark and light mode ready design tokens
- Modular suite layout for AI, resume, document, image, video, productivity, portfolio, jobs, and templates
- Quick actions, notifications, recent files, productivity summary, and AI history surfaces

The API includes:

- Health check
- Tool registry endpoint
- Unified search endpoint
- Plugin-style tool registration model
- Placeholder AI chat route for future provider integration

