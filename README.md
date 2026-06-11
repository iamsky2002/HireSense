# 🤖 HireSense AI — Intelligent Recruitment & Job Matching Platform

> *Intelligent Recruitment & Job Matching Platform*

A full-stack, multi-role recruitment platform with an **Applied-AI** layer: semantic resume ↔ job matching and a role-aware AI assistant (candidate / employer / admin).

**Status:** 🔨 In active development — the React frontend is in place; the Spring Boot backend's authentication (JWT + RBAC) is live, and the core job APIs + AI layer are next.

## Tech stack
- **Frontend:** React 19 · TypeScript · Tailwind CSS · Mantine · React Context
- **Backend:** Java · Spring Boot · Spring Security + JWT (RBAC) · JPA/Hibernate · MySQL
- **AI:** Spring AI / LangChain4j · embeddings · Qdrant (vector DB) · RAG agent
- **DevOps:** Docker · Docker Compose

## What it does (target)
- **Candidates** — search & apply for jobs, upload a resume, get AI-matched jobs, ask an AI assistant.
- **Employers** — post jobs, review applicants, find best-fit candidates with AI.
- **Admin** — manage users/jobs, view platform stats.

## Repo structure
```
frontend/   React app (UI)
backend/    Spring Boot REST API (auth + JWT)
```

## Getting started (frontend)
```bash
cd frontend
npm install
npm start
```
Opens `http://localhost:3000`.

## Backend
Spring Boot REST API with **JWT authentication + RBAC** (live). Core job APIs are in progress. Will run via Docker Compose alongside MySQL (and Qdrant for the AI layer) in a later phase.

---
Built by **Sumit (SKY)**
