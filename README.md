# 🎯 HireSense — Intelligent Recruitment & Job Matching Platform

> A full-stack, multi-role recruitment platform — search and apply for jobs, manage applicants, and track every step in one place.

### 🌐 Live demo: **[hire-sense-phi.vercel.app](https://hire-sense-phi.vercel.app)**

> Use the **Quick Demo Login** on the login page (Candidate / Employer) to explore without signing up.
> Frontend on Vercel, backend (Dockerized Spring Boot + MySQL) on AWS EC2.

## Tech stack
- **Frontend:** React 19 · TypeScript · Tailwind CSS · Mantine · React Context
- **Backend:** Java 21 · Spring Boot 3.5 · Spring Security + JWT (RBAC) · JPA/Hibernate · MySQL
- **DevOps:** Docker · Docker Compose · AWS EC2 (Caddy reverse proxy + HTTPS) · Vercel
- **Planned (AI layer):** Spring AI · embeddings · Qdrant (vector DB) · RAG assistant

## What it does
- **Candidates** — search & apply for jobs (one click), upload a PDF resume, track every application's status.
- **Employers** — post jobs, review applicants, update statuses, browse a privacy-safe talent directory.
- **Security** — JWT auth with role-based access control and ownership checks; tested with JUnit + Mockito.

## Repo structure
```
frontend/   React app (UI)
backend/    Spring Boot REST API (auth, jobs, applications, profiles, talent + unit tests)
```

## Run locally
**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm start            # http://localhost:3000
```
**Backend + MySQL (Docker):**
```bash
JWT_SECRET=<a-long-random-secret> docker compose up --build
```
Or run the backend directly with Maven (JDK 21) against a local MySQL — see `backend/.env.example`.

## Status
Phases 0–2 complete and deployed: setup, auth + RBAC, and full core CRUD (jobs, applications, profiles, talent) with unit tests. AI matching + assistant are the next phases.

---
Designed & Developed by **Sumeet Kumar (SKY)** · [github.com/iamsky2002](https://github.com/iamsky2002)
