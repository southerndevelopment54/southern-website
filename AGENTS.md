# Southern Services Website — Agent Guide

> **Context for AI coding agents.** This file describes the actual project structure, build commands, and conventions. Read it before making changes.

---

## Project Overview

This is a full-stack web application for **Southern (Security & Property Management) Co., Ltd.** (南方(警衛及管業)有限公司), a Hong Kong security company. The monorepo contains:

- **Backend** (`backend/`): Spring Boot REST API
- **Frontend** (`frontend/`): Next.js 14 application with i18n (Chinese Traditional `zh`, English `en`, Chinese Simplified `cn`)
- **Infrastructure** (`docker-compose.yml`, `nginx/`): Dockerised PostgreSQL, MinIO, HashiCorp Vault, and Nginx reverse proxy

### What the application does

- **Public website**: Company information, services, client showcase, job vacancies, contact forms
- **Admin panel**: JWT-protected dashboard for managing vacancies, job applications, service inquiries, clients, guarding sites, tier limits, and vacancy inquiries
- **File storage**: Images uploaded by admins are stored in MinIO (S3-compatible)
- **Secrets management**: JWT signing key is loaded from HashiCorp Vault at startup

---

## Technology Stack

### Backend

| Layer | Technology |
|-------|------------|
| Language / Runtime | Java 21 |
| Framework | Spring Boot 3.2.5 |
| Data Access | Spring Data JPA (Hibernate), PostgreSQL 16 driver |
| Migrations | Flyway |
| Security | Spring Security, JWT (jjwt 0.12.x), BCrypt |
| Secrets | Spring Cloud Vault (HashiCorp Vault) |
| Object Storage | MinIO Java SDK 8.5.7 |
| Build Tool | Maven |
| Packaging | JAR (executable) |

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Components | shadcn/ui (Radix UI primitives) |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |
| Carousels | Embla Carousel |

### Infrastructure

| Service | Image / Version |
|---------|-----------------|
| Database | PostgreSQL 16 |
| Object Storage | MinIO (latest) |
| Secrets | HashiCorp Vault 1.15 |
| Reverse Proxy | Nginx (Alpine) |

---

## Directory Structure

```
repo-root/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── Dockerfile.local          # Offline build (assumes pre-built JAR)
│   └── src/
│       ├── main/java/com/securityco/
│       │   ├── SecurityCoApplication.java
│       │   ├── config/           # Security, JWT, MinIO configs
│       │   ├── controller/       # REST controllers (public + admin)
│       │   ├── service/          # Business logic
│       │   ├── repository/       # Spring Data JPA repos
│       │   ├── model/            # JPA entities
│       │   ├── dto/              # Request/response DTOs
│       │   ├── security/         # JWT filter, entry point, UserDetails
│       │   └── exception/        # Global exception handler
│       ├── main/resources/
│       │   ├── application.yml
│       │   └── db/migration/     # Flyway SQL migrations
│       └── test/
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── components.json           # shadcn/ui config
│   ├── Dockerfile
│   └── src/
│       ├── app/                  # Next.js App Router
│       │   ├── layout.tsx        # Root layout
│       │   ├── [locale]/         # Public pages (i18n)
│       │   │   ├── page.tsx      # Homepage
│       │   │   ├── about/
│       │   │   ├── services/
│       │   │   ├── clients/
│       │   │   ├── careers/
│       │   │   └── contact/
│       │   ├── admin/            # Admin panel pages
│       │   │   ├── login/
│       │   │   ├── dashboard/
│       │   │   ├── vacancies/
│       │   │   ├── submissions/
│       │   │   ├── inquiries/
│       │   │   ├── vacancy-inquiries/
│       │   │   ├── clients/
│       │   │   ├── projects/
│       │   │   └── tier-limits/
│       │   └── api/              # Next.js API rewrites (not real routes)
│       ├── components/
│       │   ├── sections/         # Public page sections
│       │   ├── ui/               # shadcn/ui components
│       │   └── admin/            # Admin-specific components
│       ├── hooks/                # Custom React hooks
│       ├── lib/                  # API client, i18n utilities, helpers
│       ├── store/                # Zustand stores (auth)
│       └── types/                # TypeScript type definitions
├── nginx/
│   ├── nginx.conf                # Docker Compose proxy config
│   └── nginx.infra.conf          # Local dev proxy config
├── docker-compose.yml            # Full stack (infra + apps)
├── docker-compose.infra.yml      # Infrastructure only
└── .env / .env.example
```

---

## Build and Run Commands

### Prerequisites

- Java 21 + Maven 3.9+ (for backend)
- Node.js 20 + npm (for frontend)
- Docker + Docker Compose (for infrastructure)

### Development (recommended)

Start only infrastructure services, then run apps on the host machine:

```bash
# 1. Start PostgreSQL, MinIO, Vault, Nginx
docker compose -f docker-compose.infra.yml up -d

# 2. Start backend (port 8080)
cd backend
mvn spring-boot:run

# 3. Start frontend dev server (port 3000)
cd frontend
npm run dev
```

The infra Nginx (`nginx.infra.conf`) proxies:
- `http://localhost/api/*` → host backend (`host.docker.internal:8080`)
- `http://localhost/*` → host frontend (`host.docker.internal:3000`)

### Full Docker Stack

```bash
# Build and run everything (backend, frontend, infra)
docker compose up --build -d
```

### Production Build

```bash
# Backend
cd backend && mvn clean package -DskipTests

# Frontend (standalone output)
cd frontend && npm run build
```

### Common Frontend Commands

```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

---

## Environment Variables

### Backend (`backend/src/main/resources/application.yml`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_NAME` | `postgres` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | *(required)* | Database password |
| `MINIO_ENDPOINT` | `http://localhost:9000` | MinIO internal URL |
| `MINIO_EXTERNAL_ENDPOINT` | *(empty)* | MinIO public URL |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO access key |
| `MINIO_SECRET_KEY` | `minioadmin` | MinIO secret key |
| `MINIO_BUCKET` | `security-co` | MinIO bucket name |
| `VAULT_ENABLED` | `true` | Enable Spring Cloud Vault |
| `VAULT_ADDR` | `http://localhost:8200` | Vault URL |
| `VAULT_TOKEN` | `dev-token` | Vault token |
| `JWT_SECRET` | *(fallback default)* | JWT signing key (overridden by Vault if available) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Public API base URL (e.g., `http://localhost:8080`) |
| `API_URL` | Server-side API base URL (used in `next.config.mjs` rewrites) |

---

## Database Schema

Flyway migrations live in `backend/src/main/resources/db/migration/`:

- `V1__init_schema.sql` — Baseline schema with all tables, indexes, and seed data
- `V2__expand_site_categories.sql` — Guarding site category expansion
- `V3__add_sub_category_and_revert_category_expansion.sql` — Sub-category addition

### Key Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin accounts (BCrypt password hashes) |
| `audit_log` | Admin action audit trail |
| `vacancies` | Job vacancy postings |
| `applicant_submissions` | Job applications from public users |
| `contact_messages` | Service inquiry form submissions |
| `vacancy_inquiries` | General job inquiries (not tied to a specific vacancy) |
| `clients` | Partner client companies |
| `guarding_sites` | Security site / project portfolio |
| `tier_limits` | Max featured items per site category |
| `districts` | Hong Kong districts lookup |
| `security_guard_types` | Security guard role types lookup |
| `education_levels` | Education levels lookup |
| `enterprise_types` | Client enterprise type lookup |

**Default admin credentials** (seeded in V1): `admin` / `admin123`

---

## Authentication Architecture

### JWT Tokens

- **Algorithm**: HS512
- **Access token expiry**: 15 minutes (900,000 ms)
- **Refresh token expiry**: 7 days (604,800,000 ms)
- **Signing key**: Loaded from HashiCorp Vault (`secret/security-co` → `jwt.secret`)

### Spring Security Filter Chain

- CSRF: disabled (stateless JWT)
- Session: `STATELESS`
- Public endpoints (no auth): `/api/auth/**`, `/api/vacancies/**`, `/api/education-levels`, `/api/submissions`, `/api/contact`, `/api/vacancy-inquiries`, `/api/clients/**`, `/api/projects/**`, `/api/files/**`, `/actuator/health`
- Admin endpoints: `/api/admin/**` requires valid JWT
- CORS: allowed from all origins (`*`) with credentials

### Frontend Auth Flow

1. Admin logs in via `/admin/login` → POST `/api/auth/login`
2. Access token + refresh token stored in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. On 401 response: attempt `/api/auth/refresh` with refresh token; if that fails, redirect to `/admin/login`
5. Admin layout (`frontend/src/app/admin/layout.tsx`) guards all admin pages client-side

---

## API Conventions

### Backend

- Base path: `/api`
- Controllers use `@RestController` + `@RequestMapping("/api/...")`
- DTOs are used for request/response bodies
- Validation via Jakarta Bean Validation (`@Valid`)
- Global exception handler (`GlobalExceptionHandler`) maps custom exceptions to HTTP status codes
- Admin controllers are prefixed with `/api/admin/...`
- Public controllers are prefixed with `/api/...`

### Frontend

- API client in `frontend/src/lib/api.ts` creates an Axios instance
- Browser calls use same-origin `/api` (Nginx proxies to backend)
- SSR calls use `http://backend:8080/api` directly
- File uploads go through `/api/admin/upload` → stored in MinIO

---

## i18n (Internationalisation)

- Supported locales: `zh` (Traditional Chinese, default), `en` (English), `cn` (Simplified Chinese)
- Translations are hard-coded in `frontend/src/lib/i18n.ts` (not fetched from an API)
- `middleware.ts` redirects locale-less paths to the cookie-stored locale or defaults to `zh`
- Admin panel is **not** internationalised (Chinese UI only)
- Public pages live under `app/[locale]/...`

---

## Code Style Guidelines

### Backend (Java)

- Package: `com.securityco`
- Use Lombok (`@RequiredArgsConstructor`, `@Getter`, `@Setter`, etc.)
- Use constructor injection (Lombok-generated)
- Use Spring Data JPA repositories (no custom SQL unless necessary)
- DTOs for all request/response payloads
- Custom exceptions extend `RuntimeException`
- Use `Optional` in repository methods where appropriate

### Frontend (TypeScript / React)

- Use function components with explicit type annotations
- Path alias `@/` maps to `src/`
- shadcn/ui components live in `src/components/ui/`
- `use client` directive for client components (forms, hooks, stores)
- Server components are the default (no directive)
- Tailwind CSS for all styling; custom colours defined in `tailwind.config.ts`
- Zustand stores for global state; React Hook Form + Zod for form state

---

## Testing

**There are currently no automated tests in this project.**

If adding tests:

- **Backend**: Use `spring-boot-starter-test` and `spring-security-test` (already on classpath)
- **Frontend**: Add Jest / Vitest + React Testing Library as dev dependencies

### Manual Testing Checklist

- Public pages load in all three locales (`/zh`, `/en`, `/cn`)
- Vacancy listing, filtering, and detail pages work
- Job application form validates and submits (rate-limited to 1 per minute per IP)
- Service inquiry form submits correctly
- Admin login accepts `admin` / `admin123`
- JWT expires after 15 minutes; refresh works
- Admin CRUD for vacancies, submissions, inquiries, clients, projects
- Image upload works and displays correctly
- Dashboard statistics are accurate
- Responsive on mobile, tablet, desktop

---

## Security Considerations

- **Never commit secrets**: `.env`, `.env.local`, and Vault tokens are gitignored
- **JWT secret**: In production, the signing key must come from Vault (not the fallback default in `application.yml`)
- **Password storage**: Admin passwords are hashed with BCrypt
- **Rate limiting**: `RateLimitService` enforces a 1-minute cooldown per IP on submission endpoints (in-memory, not distributed)
- **File uploads**: Restricted to 10MB; validate file types on the client and server
- **SQL injection**: Prevented by JPA parameterized queries
- **XSS**: React's built-in escaping; no `dangerouslySetInnerHTML` on user input
- **CORS**: Currently allows all origins (`*`) — tighten for production
- **MinIO**: Images are publicly accessible if the bucket policy allows it; use presigned URLs if stricter access is needed

---

## Deployment Notes

### Docker Compose (`docker-compose.yml`)

Builds all services:
- `postgres` — port `5432`
- `minio` — ports `9000` (API), `9001` (console)
- `vault` — port `8200`
- `vault-seed` — one-shot container that writes `jwt.secret` to Vault
- `backend` — port `8080`
- `frontend` — port `3000` (standalone output)
- `nginx` — port `80` (reverse proxy)

### Nginx Configurations

- `nginx/nginx.conf` — Service-name based proxy (for Docker Compose full stack)
- `nginx/nginx.infra.conf` — `host.docker.internal` based proxy (for local dev with host-running apps)

### Before Production Deployment

1. Change `server_name localhost` to your actual domain in both Nginx configs
2. Add SSL (listen 443 + certificate paths)
3. Replace Vault dev mode with a production Vault setup
4. Change all default passwords (`admin123`, MinIO `minioadmin`, PostgreSQL defaults)
5. Restrict CORS origins in `SecurityConfig.java`
6. Consider a distributed rate limiter (Redis) instead of in-memory `ConcurrentHashMap`
7. Enable malware scanning on file uploads

---

## Common Issues

- **Frontend SSR cannot reach backend**: `next.config.mjs` rewrites use `process.env.API_URL`; ensure it is set correctly at build time for Docker
- **Vault not seeded**: If backend fails to start with "JWT secret not found", ensure `vault-seed` service ran successfully
- **MinIO bucket missing**: Create the `security-co` bucket manually if it does not exist
- **Locale redirect loops**: Ensure `middleware.ts` does not redirect `/admin`, `/api`, `/images`, `/fonts`, or files with extensions
