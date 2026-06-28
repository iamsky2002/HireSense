# HireSense

Full-stack recruitment platform built with React + Spring Boot. Candidates search and apply for jobs, employers manage applicants through a 7-stage hiring pipeline, and an AI layer matches resumes to jobs using vector embeddings.

**Live:** [hire-sense-phi.vercel.app](https://hire-sense-phi.vercel.app)
— use the Quick Demo Login (Candidate / Employer) on the login page to try it without signing up.
Frontend on Vercel, backend (Dockerized Spring Boot + MySQL) on AWS EC2 with HTTPS via Caddy.

Swagger UI live	✅ 200 → https://52-65-41-124.sslip.io/swagger-ui/index.html

## Why I built this

I wanted one project where I could explain every technical decision in an interview — not a tutorial follow-along, but something I actually designed and debugged myself. Recruitment was a good fit because it has enough complexity: auth with multiple roles, ownership-based access control, search with filters and pagination, file uploads, a real deployment pipeline, and a natural use case for AI (matching resumes to jobs by meaning, not just keywords).

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, TypeScript, Tailwind CSS, Mantine UI, React Context |
| Backend | Java 21, Spring Boot 3.5, Spring Security + JWT, JPA/Hibernate, MySQL 8 |
| AI | Gemini `text-embedding-004` (REST), Qdrant vector DB, cosine similarity matching |
| DevOps | Docker, Docker Compose, AWS EC2, Caddy (reverse proxy + HTTPS), Vercel |

## What it does

**Candidates** — search jobs with filters (title, location, experience, salary range), apply in one click, upload a PDF resume, track application status through the pipeline, and see AI-recommended jobs ranked by resume fit.

**Employers** — post jobs, manage applicants through a 7-stage pipeline (Applied → Screening → Shortlisted → Assessment → Interview → Offered → Hired), reject with a reason, and view AI-ranked candidate matches per job.

**Admins** — platform stats, user management (enable/disable accounts — disable actually blocks login, not just a flag).

**Security** — JWT auth, BCrypt passwords, role-based access on every endpoint, ownership checks in the service layer (employer can only see applicants for their own jobs). The AI layer runs through the same RBAC — no raw DB access.

## Architecture highlights

- **Layered backend:** Controller → Service (business logic + RBAC) → Repository. DTOs everywhere, entities never leak to the API.
- **Embed-on-write:** when a job is posted or a profile is updated, the text is embedded and upserted into Qdrant immediately. Matching queries are just a cosine search — no embedding at read time.
- **Best-effort AI:** if the Gemini API or Qdrant is down, the job still saves. AI features degrade gracefully, core CRUD never breaks.
- **React Context over Redux:** intentional choice — the app's state is simple enough that Context + hooks handles it without the Redux boilerplate.
- **Stateless JWT:** no server-side sessions, so the backend stays simple and could scale out later without sticky-session issues.

## Repo structure

```
frontend/   React app (TypeScript, Tailwind, Mantine)
backend/    Spring Boot REST API
  ├── auth/          register, login, JWT filter
  ├── job/           CRUD + search + pagination
  ├── application/   apply, status pipeline, reject-with-reason
  ├── candidate/     profile, resume upload
  ├── company/       employer company management
  ├── ai/            embedding client, Qdrant client, match service, index service
  ├── admin/         stats, user management
  ├── config/        security config, CORS, web config
  └── common/        global exception handler, shared DTOs
```

## API reference

> **Interactive docs (Swagger UI):** once the backend is running, open **`/swagger-ui.html`** to browse every endpoint, see the schemas, and try calls live (the **Authorize** button takes a JWT). The OpenAPI spec is auto-generated at `/v3/api-docs`.

Everything is under `/api`. Protected routes need `Authorization: Bearer <token>`; the role column shows who can call what.

**Auth**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | create a candidate/employer account |
| POST | `/api/auth/login` | public | log in, returns a JWT |

**Jobs**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/jobs` | public | search/filter/paginate (`?title=&location=&type=&page=&size=&sort=`) |
| GET | `/api/jobs/{id}` | public | single job |
| GET | `/api/jobs/mine` | EMPLOYER | jobs I posted |
| POST | `/api/jobs` | EMPLOYER | create a job |
| PUT | `/api/jobs/{id}` | EMPLOYER (owner) | update my job |
| DELETE | `/api/jobs/{id}` | EMPLOYER (owner) | delete my job |

**Applications**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/jobs/{id}/apply` | CANDIDATE | apply (duplicate → 409) |
| GET | `/api/applications/me` | CANDIDATE | my applications |
| GET | `/api/jobs/{id}/applicants` | EMPLOYER (owner) | applicants for my job |
| PATCH | `/api/applications/{id}/status` | EMPLOYER (owner) | move stage / reject with reason |

**Profile & saved jobs (candidate)**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/me/profile` | CANDIDATE | my profile |
| PUT | `/api/me/profile` | CANDIDATE | update profile |
| POST | `/api/me/resume` | CANDIDATE | upload PDF resume (multipart, `file`) |
| GET | `/api/me/saved-jobs` | CANDIDATE | my bookmarked jobs |
| POST | `/api/jobs/{id}/save` | CANDIDATE | bookmark a job |
| DELETE | `/api/jobs/{id}/save` | CANDIDATE | remove bookmark |

**Talent (employer)**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/candidates` | EMPLOYER | browse candidates |
| GET | `/api/candidates/{id}` | EMPLOYER | candidate detail |

**AI matching**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/matches/jobs` | CANDIDATE | jobs ranked for my profile |
| GET | `/api/matches/jobs/{id}/candidates` | EMPLOYER (owner) | candidates ranked for my job |

**Admin**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | ADMIN | platform counts |
| GET | `/api/admin/users` | ADMIN | all users |
| PATCH | `/api/admin/users/{id}/enabled?enabled=` | ADMIN | enable/disable a user |

**Misc**
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/me` | logged-in | current user (from the token) |
| GET | `/api/health` | public | health check |

### Example — login
`POST /api/auth/login`
```json
{ "email": "ravi@example.com", "password": "your-password" }
```
→ `200 OK`
```json
{ "token": "eyJhbGciOiJI...", "userId": 5, "email": "ravi@example.com", "fullName": "Ravi Kumar", "role": "CANDIDATE" }
```

### Example — create a job (employer)
`POST /api/jobs` · `Authorization: Bearer <token>`
```json
{
  "title": "Java Backend Developer",
  "description": "Spring Boot + MySQL, REST APIs...",
  "location": "Remote",
  "experience": "0-2 years",
  "type": "FULL_TIME",
  "salaryMin": 600000,
  "salaryMax": 1000000,
  "skills": ["Java", "Spring Boot", "MySQL"]
}
```
→ `201 Created`
```json
{
  "id": 12,
  "title": "Java Backend Developer",
  "description": "Spring Boot + MySQL, REST APIs...",
  "location": "Remote",
  "experience": "0-2 years",
  "type": "FULL_TIME",
  "salaryMin": 600000,
  "salaryMax": 1000000,
  "postedAt": "2026-06-23T10:15:00Z",
  "company": "Acme Corp",
  "skills": ["Java", "Spring Boot", "MySQL"]
}
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
docker compose up --build
```

**Environment variables** (backend reads from env, defaults work for local dev):

| Variable | What it does | Required |
|----------|-------------|----------|
| `JWT_SECRET` | signing key for JWT tokens | yes (any 32+ char string) |
| `DB_PASSWORD` | MySQL root password | no (empty default for local) |
| `GEMINI_API_KEY` | Gemini API key for embeddings | no (AI features off without it) |
| `QDRANT_URL` | Qdrant endpoint | no (defaults to localhost:6333) |

Or run the backend directly with Maven (JDK 21) against a local MySQL — see `backend/.env.example`.

## What I ran into (and learned)

A few things that didn't work the first time — these taught me more than the parts that just worked:

- **Tailwind and Mantine fighting over colors** — each has its own theme config, so my custom palette only applied to one of them. I had to define the same colors in both `tailwind.config.js` and the Mantine theme to get one consistent look across the app.
- **Custom multi-select filter** — I built the tag-style multi-select by hand instead of using a library. Wiring up the add/remove tags and the dropdown state taught me a lot about controlled components in React.
- **Images 404'd only in production** — they loaded fine on my Windows machine but broke on the live Linux server. Windows ignores filename case, Linux doesn't, so `Girl.png` vs `girl.png` actually mattered.
- **404 instead of 403 on protected routes** — Spring Security was returning the wrong status because of how it re-dispatches errors. A global exception handler (plus permitting `/error`) fixed it, and I finally understood the security filter chain properly.
- **App wouldn't boot on a 1GB EC2** — it ran out of memory on startup. I added swap and capped the JVM + MySQL memory. Running locally and running on a tiny cloud box turned out to be two pretty different things.

## Current status

- Auth + RBAC, core CRUD (jobs, applications, profiles, talent), and deployment are all live.
- Three role-based dashboards (candidate, employer, admin) with a 7-stage hiring pipeline.
- AI matching code (Gemini embeddings + Qdrant) is written, tested, and pushed. Deploying Qdrant on EC2 for live end-to-end matching is the next step.
- After that: role-aware AI chatbot (tool-calling agent), then test coverage and polish.

---
Built by **Sumeet Kumar (SKY)** · [github.com/iamsky2002](https://github.com/iamsky2002)
