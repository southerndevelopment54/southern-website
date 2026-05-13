# Southern Security Services — Agent Guide

> A full-stack web application for a Hong Kong security company (南方保安服務). This is a monorepo containing a Spring Boot REST API and a Next.js frontend application.

## Project Overview

- **Purpose:** Public company website (vacancy listings, job applications, contact) + admin control panel (vacancy CRUD, applicant review, dashboard).
- **Language:** UI content is Traditional Chinese (`zh-Hant`); code and documentation are in English.
- **Architecture:** Monorepo with backend (`/backend`) and frontend (`/frontend`), orchestrated by Docker Compose.
- **Infrastructure:** PostgreSQL 16, MinIO (S3-compatible object storage), HashiCorp Vault (secrets), Nginx (reverse proxy).

## Technology Stack

### Backend
- **Java 21**, **Spring Boot 3.2.5**
- **Spring Data JPA** (Hibernate) with PostgreSQL
- **Spring Security** (JWT, stateless sessions, CSRF disabled)
- **Spring Cloud Vault** (HashiCorp Vault integration)
- **Flyway** (database migrations)
- **MinIO Java SDK** (object storage)
- **jjwt 0.12.x** (JWT signing/validation, HS512)
- **Maven** (build tool)

### Frontend
- **Next.js 14** (App Router, standalone output)
- **React 18**, **TypeScript 5**
- **Tailwind CSS 3.4**, **shadcn/ui**
- **Zustand** (client state management)
- **React Hook Form + Zod** (forms and validation)
- **Axios** (HTTP client)

## Directory Structure

```
repo-root/
├── backend/                  # Spring Boot application
│   ├── pom.xml
│   ├── src/main/java/com/securityco/
│   │   ├── SecurityCoApplication.java
│   │   ├── config/           # SecurityConfig, JwtConfig, MinioConfig, WebConfig
│   │   ├── controller/       # REST controllers (public + admin)
│   │   ├── service/          # Business logic + scheduler
│   │   ├── repository/       # Spring Data JPA interfaces
│   │   ├── model/            # JPA entities
│   │   ├── dto/              # Request/response DTOs
│   │   ├── security/         # JWT filters, JwtService, UserDetailsService
│   │   ├── exception/        # GlobalExceptionHandler + custom exceptions
│   │   └── mapper/           # VacancyMapper
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/     # Flyway migrations (V1–V10)
│   ├── src/test/             # (currently empty — no tests)
│   └── Dockerfile
├── frontend/                 # Next.js application
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── public/       # Public site components
│   │   │   ├── admin/        # Admin panel components
│   │   │   └── ui/           # shadcn/ui components
│   │   ├── lib/              # api.ts (axios), utils.ts
│   │   ├── hooks/            # useApi, useAuth, use-toast
│   │   ├── store/            # Zustand auth store
│   │   └── types/            # TypeScript interfaces
│   ├── public/
│   └── Dockerfile
├── nginx/
│   ├── nginx.conf            # Docker Compose reverse proxy
│   └── nginx.infra.conf      # Local dev reverse proxy
├── docker-compose.yml        # Full stack (all services)
├── docker-compose.infra.yml  # Infrastructure only (backend/frontend on host)
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment variable template
└── README.md
```

## Build and Run Commands

### Prerequisites
- Java 21 + Maven 3.9 (or use `./mvnw`)
- Node.js 20 + npm
- Docker + Docker Compose
- Copy `.env.example` to `.env` and configure values

### Development (backend + frontend on host, infrastructure in Docker)

```bash
# 1. Start infrastructure services
docker-compose -f docker-compose.infra.yml up -d

# 2. Start backend (port 8080)
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# OR
./mvnw clean package -DskipTests
java -jar target/*.jar

# 3. Start frontend (port 3000)
cd frontend
npm install
npm run dev
```

### Production Build

```bash
# Backend
cd backend && ./mvnw clean package -DskipTests

# Frontend
cd frontend && npm run build

# Or build everything with Docker Compose
docker-compose up --build -d
```

### Full Docker Compose (all services)

```bash
docker-compose up --build -d
```

Services exposed:
- Nginx (reverse proxy): `http://localhost:80`
- Frontend (direct): `http://localhost:3000`
- Backend API (direct): `http://localhost:8080`
- MinIO console: `http://localhost:9001`
- Vault UI: `http://localhost:8200`
- PostgreSQL: `localhost:5432`

## Environment Variables

Required variables (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` | PostgreSQL credentials |
| `VAULT_ENABLED` / `VAULT_ADDR` / `VAULT_TOKEN` | HashiCorp Vault connection |
| `MINIO_ENDPOINT` / `MINIO_EXTERNAL_ENDPOINT` | MinIO internal and public endpoints |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | MinIO credentials |
| `MINIO_BUCKET` | MinIO bucket name (`security-co`) |
| `JWT_SECRET` | JWT signing secret (min 64 chars; also seeded into Vault) |

The backend `application.yml` contains defaults for local development but **must be overridden in production**.

## API and Routing

### Backend Endpoints

**Public (no auth):**
- `GET /api/vacancies` — List active vacancies (paginated, filterable)
- `GET /api/vacancies/{id}` — Vacancy detail
- `GET /api/vacancies/districts` — Districts
- `GET /api/vacancies/guard-types` — Guard types
- `GET /api/education-levels` — Education levels
- `POST /api/submissions` — Submit job application
- `POST /api/contact` — Contact form
- `GET /actuator/health` — Health check

**Admin (JWT required):**
- `POST /api/auth/login` — Admin login
- `POST /api/auth/refresh` — Refresh token
- `GET /api/admin/dashboard` — Dashboard stats
- `CRUD /api/admin/vacancies` — Vacancy management
- `GET /api/admin/submissions` — List submissions
- `GET /api/admin/submissions/{id}` — Submission detail
- `PUT /api/admin/submissions/{id}/status` — Update status
- `POST /api/admin/upload` — Image upload to MinIO

### Frontend Routing

The Next.js frontend rewrites `/api/*` to the backend (configured in `next.config.mjs`).

**Public pages:**
- `/` — Homepage
- `/about`, `/services`, `/contact`
- `/vacancies` — Job listings
- `/vacancies/[id]` — Job detail + application form

**Admin pages (protected client-side):**
- `/admin/login`
- `/admin/dashboard`
- `/admin/vacancies` — List
- `/admin/vacancies/new` — Create
- `/admin/vacancies/[id]/edit` — Edit
- `/admin/submissions` — Review applications

## Authentication

- **Mechanism:** JWT (HS512), stateless, CSRF disabled.
- **Tokens:** Access token (15 minutes) + refresh token (7 days).
- **Storage:** Access token in `localStorage`; refresh token returned in response body and also handled via store.
- **Frontend:** Axios interceptor auto-attaches `Bearer` token; on 401, attempts refresh via `/auth/refresh`, then redirects to `/admin/login` if refresh fails.
- **Default admin:** Seeded by Flyway V2 (`admin` / bcrypt hash; updated in V3).
- **Secret source:** Vault (`secret/security-co` path) with `JWT_SECRET` env fallback.

## Database

- **Engine:** PostgreSQL 16
- **Migrations:** Flyway, located in `backend/src/main/resources/db/migration/`
- **Migration files (V1–V10):**
  1. `V1__init_schema.sql` — Core tables (`vacancies`, `applicant_submissions`, `admin_users`, `audit_log`, `education_levels`, `security_guard_types`, `districts`)
  2. `V2__seed_data.sql` — Seed data (education levels, guard types, 18 HK districts, default admin)
  3. `V3__fix_admin_password.sql` — Fix default admin password hash
  4. `V4__translate_to_traditional_chinese.sql` — Translate seed data to Traditional Chinese
  5. `V5__create_contact_messages.sql` — Add `contact_messages` table
  6. `V6__fix_audit_log_details_type.sql` — Change `audit_log.details` to TEXT
  7. `V7__revert_audit_log_details_to_jsonb.sql` — Revert to JSONB
  8. `V8__fix_audit_log_ip_address_type.sql` — Change IP to VARCHAR(45)
  9. `V9__fix_submissions_ip_address_type.sql` — Change submission IP to VARCHAR(45)
  10. `V10__add_submission_audit_columns.sql` — Add `user_agent`, `admin_notes`, `reviewed_by`, `reviewed_at`

- **JPA:** `ddl-auto: validate` (Flyway owns schema changes).

## Code Style Guidelines

- **Java:** Standard Spring Boot conventions; package `com.securityco`.
  - Controllers return `ResponseEntity<T>`.
  - DTOs are immutable records or classes with Lombok.
  - Services are annotated with `@Service` and use constructor injection.
  - Repositories extend `JpaRepository`.
- **TypeScript / React:**
  - Strict TypeScript enabled.
  - Path alias `@/*` maps to `src/*`.
  - shadcn/ui components live in `src/components/ui/`.
  - Public components in `src/components/public/`; admin components in `src/components/admin/`.
  - Hooks prefixed with `use`.
  - Zustand stores in `src/store/`.

## Testing

**Current state: No automated tests exist.**

There are no JUnit tests in `backend/src/test/` and no frontend tests (`*.test.*` / `*.spec.*`) in the frontend.

### Manual Testing Checklist

- Public vacancy listing loads and filters work
- Vacancy detail page shows correct data
- Application form validates and submits successfully
- Rate limiting blocks rapid submissions (1 per minute per IP)
- Admin login works with valid credentials; rejects invalid ones
- JWT token expires after 15 minutes; refresh flow works
- Admin can create, edit, delete vacancies
- Image upload works and image displays correctly
- Admin can view and update submission statuses
- Dashboard shows accurate statistics
- Responsive design on mobile, tablet, and desktop

## Security Considerations

- **Admin endpoints** require valid JWT (`/api/admin/**`).
- **Public endpoints** are explicitly allow-listed in `SecurityConfig`.
- **Submission rate limiting:** `RateLimitService` limits job applications to 1 per minute per IP.
- **Passwords:** Stored with BCrypt (`BCryptPasswordEncoder`).
- **File uploads:** Restricted to images (JPG/PNG), max 10MB, stored in MinIO with UUID-prefixed keys.
- **CORS:** Configured globally for `/api/**` in `WebConfig` (allows all origins in current config — tighten for production).
- **SQL Injection:** Prevented via JPA parameterized queries.
- **XSS:** Mitigated by React's built-in output escaping.
- **Secrets:** Vault is the primary secret source; env vars are fallbacks.

## Deployment

- **Backend Dockerfile:** Multi-stage Maven → JRE 21 Alpine build.
- **Frontend Dockerfile:** Multi-stage Node 20 Alpine build with `output: 'standalone'`.
- **Nginx:** Routes `/api/` and `/actuator/` to backend; everything else to frontend.
- **Health checks:** Backend exposes Spring Boot Actuator at `/actuator/health`.
- **Scheduled tasks:** `VacancyScheduler` runs hourly (`0 0 * * * *`) to deactivate expired vacancies.

## Notes for Agents

- UI text is **Traditional Chinese** — do not change it to English or Simplified Chinese unless explicitly asked.
- The project uses **Flyway** for schema changes — never use `ddl-auto: update` in production; always write a new `V{version}__*.sql` migration.
- When adding new API endpoints, update both the backend controller and the frontend `lib/api.ts` / types as needed.
- The `Agent.md` file in the project root is a binary Word document (`.docx`), not a text file — do not attempt to read or edit it as Markdown.
- `Initial-plan.md` contains the original implementation specification; it may not perfectly match the current codebase. Trust the actual source code over the plan where they differ.
