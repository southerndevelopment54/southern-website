# 南方(警衛及管業)有限公司 — Project Structure

> A full-stack website for Southern Security Services Limited, a Hong Kong security company.

---

## 1. Overview

This is a **monorepo** containing a public-facing company website with an admin control panel.

- **Public site**: Company profile, services, client showcase, job vacancies with application forms
- **Admin panel**: JWT-secured dashboard for managing vacancies, job applications (submissions), contact inquiries, client logos, partner projects, appreciation letters, and tier limits
- **Storage**: Images uploaded via admin are stored in MinIO and served through the backend

---

## 2. Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.2.5 |
| ORM | Spring Data JPA (Hibernate) |
| Security | Spring Security + JWT (jjwt 0.12.5) |
| Secrets | HashiCorp Vault |
| Database | PostgreSQL 16 |
| Migrations | Flyway |
| Object Storage | MinIO |
| Build Tool | Maven |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Components | shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Carousel | Embla Carousel |
| Icons | Lucide React |

### Infrastructure (Docker)
| Service | Image |
|---------|-------|
| Database | `postgres:16` |
| Object Storage | `minio/minio:latest` |
| Secrets | `hashicorp/vault:1.15` |
| Reverse Proxy | `nginx:alpine` |

---

## 3. Repository Structure

```
southern-website/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/securityco/
│   │   ├── config/                   # SecurityConfig, MinioConfig, JwtConfig
│   │   ├── controller/               # REST controllers (public + admin)
│   │   ├── converter/
│   │   ├── dto/                      # Request/Response DTOs
│   │   ├── exception/                # GlobalExceptionHandler
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Spring Data JPA repositories
│   │   ├── security/                 # JWT filter, entry point, UserDetails
│   │   └── service/                  # Business logic
│   ├── src/main/resources/
│   │   ├── application.yml           # Spring Boot config
│   │   └── db/migration/             # Flyway migrations (V1–V5)
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                         # Next.js application
│   ├── src/app/
│   │   ├── [locale]/                 # Public pages (zh/en/cn)
│   │   │   ├── about/page.tsx
│   │   │   ├── careers/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── services/page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/                    # Admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── vacancies/
│   │   │   ├── submissions/page.tsx
│   │   │   ├── inquiries/page.tsx
│   │   │   ├── vacancy-inquiries/page.tsx
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── security-system-clients/
│   │   │   ├── appreciation-letters/
│   │   │   └── tier-limits/page.tsx
│   │   └── layout.tsx
│   ├── src/components/
│   │   ├── sections/                 # Page section components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── SortHeader.tsx
│   │   ├── OrderSlider.tsx
│   │   ├── VacancyApplyDialog.tsx
│   │   ├── VacancyInquiryDialog.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── src/lib/
│   │   ├── api.ts                    # Axios client
│   │   ├── i18n.ts                   # Hard-coded translations (zh/cn/en)
│   │   └── image.ts                  # Image compression helper
│   ├── src/store/
│   │   └── auth.ts                   # Zustand auth store
│   ├── src/hooks/
│   │   ├── use-toast.ts
│   │   └── useSortable.ts
│   ├── src/types/
│   ├── public/images/
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── nginx/
│   ├── nginx.conf                    # Docker Compose proxy
│   └── nginx.infra.conf              # Local dev proxy (host.docker.internal)
│
├── docker-compose.yml                # Full stack (all services)
├── docker-compose.infra.yml          # Infrastructure only (DB + MinIO + Vault + Nginx)
├── .env / .env.example
└── Initial-plan.md
```

---

## 4. Docker Architecture

### 4.1 Full Stack (`docker-compose.yml`)

Launches **8 containers** for production-like local deployment:

| # | Service | Container Name | Ports | Purpose |
|---|---------|---------------|-------|---------|
| 1 | `postgres` | `postgres-db` | `5432:5432` | PostgreSQL 16 database |
| 2 | `minio` | `minio-server` | `9000:9000`, `9001:9001` | S3-compatible object storage |
| 3 | `vault` | `vault-server` | `8200:8200` | HashiCorp Vault (dev mode) |
| 4 | `vault-seed` | `vault-seed` | — | One-shot init script that seeds Vault with JWT secret |
| 5 | `backend` | `backend-app` | `8080:8080` | Spring Boot API server |
| 6 | `frontend` | `frontend-app` | `3000:3000` | Next.js standalone server |
| 7 | `nginx` | `nginx-local` | `80:80` | Reverse proxy to backend/frontend |

#### Nginx Routing (`nginx.conf`)

```
Port 80
├── /api/*      → proxy_pass http://backend:8080
├── /actuator/* → proxy_pass http://backend:8080
└── /*          → proxy_pass http://frontend:3000
```

#### Backend Environment (in Docker)

| Variable | Value |
|----------|-------|
| `DB_HOST` | `postgres` |
| `DB_NAME` | `${DB_NAME}` |
| `DB_USERNAME` | `${DB_USERNAME}` |
| `DB_PASSWORD` | `${DB_PASSWORD}` |
| `MINIO_ENDPOINT` | `http://minio:9000` |
| `MINIO_EXTERNAL_ENDPOINT` | `http://localhost:9000` |
| `MINIO_ACCESS_KEY` | `minioadmin` |
| `MINIO_SECRET_KEY` | `minioadmin` |
| `MINIO_BUCKET` | `security-co` |
| `VAULT_ENABLED` | `true` |
| `VAULT_ADDR` | `http://vault:8200` |
| `VAULT_TOKEN` | `dev-token` |

#### Frontend Environment (in Docker)

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| Build arg `API_URL` | `http://backend:8080` |

---

### 4.2 Infrastructure Only (`docker-compose.infra.yml`)

For **local development** where you run backend/frontend manually on your host:

| # | Service | Container Name | Ports | Purpose |
|---|---------|---------------|-------|---------|
| 1 | `postgres` | `postgres-db` | `5432:5432` | PostgreSQL 16 |
| 2 | `minio` | `minio-server` | `9000:9000`, `9001:9001` | MinIO |
| 3 | `vault` | `vault-server` | `8200:8200` | Vault |
| 4 | `vault-seed` | `vault-seed` | — | Seed script |
| 5 | `nginx` | `nginx-local` | `80:80` | Proxy to `host.docker.internal` |

Nginx routes to `host.docker.internal:8080` (backend) and `host.docker.internal:3000` (frontend).

---

### 4.3 Dockerfiles

#### Backend (`backend/Dockerfile`)
- **Build stage**: `maven:3.9-eclipse-temurin-21-alpine` → builds JAR with Maven
- **Run stage**: `eclipse-temurin:21-jre-alpine` → runs the JAR on port 8080

#### Frontend (`frontend/Dockerfile`)
- **Deps stage**: `node:20-alpine` → `npm ci`
- **Build stage**: `node:20-alpine` → `npm run build` (output: standalone)
- **Run stage**: `node:20-alpine` → serves `.next/standalone` on port 3000

---

## 5. Backend Architecture

### 5.1 Package Structure

```
com.securityco/
├── config/
│   ├── SecurityConfig.java          # Spring Security filter chain, CORS, public paths
│   ├── MinioConfig.java             # MinIO client bean + properties
│   └── JwtConfig.java               # JWT properties (expiry times)
├── controller/                      # 20+ controllers
│   ├── AuthController.java          # POST /api/auth/login, /api/auth/refresh
│   ├── Public*Controller.java       # Public read-only endpoints
│   ├── Admin*Controller.java        # CRUD endpoints (JWT-protected)
│   ├── FileController.java          # GET /api/files/* → serves MinIO objects
│   └── UploadController.java        # POST /api/admin/upload → MinIO upload
├── dto/                             # 20+ DTOs
│   ├── *Request.java                # @Valid input DTOs
│   └── *Response.java               # Output DTOs with imageUrl from MinIO
├── model/                           # 14 JPA entities
│   ├── Vacancy.java
│   ├── ApplicantSubmission.java
│   ├── GuardingSite.java
│   ├── Client.java
│   ├── SecuritySystemClient.java
│   ├── AppreciationLetter.java
│   ├── ContactMessage.java
│   ├── VacancyInquiry.java
│   ├── AuditLog.java
│   └── ...
├── repository/                      # 14 Spring Data repositories
├── service/                         # 14 business services
│   ├── AuthService.java
│   ├── VacancyService.java
│   ├── SubmissionService.java
│   ├── MinioService.java            # Upload + presigned/public URL generation
│   ├── RateLimitService.java        # IP-based rate limiting (global + per-vacancy)
│   └── AuditLogService.java
├── security/
│   ├── JwtAuthenticationFilter.java # Extracts & validates JWT from header
│   ├── JwtAuthenticationEntryPoint.java
│   └── AdminUserDetailsService.java
└── exception/
    └── GlobalExceptionHandler.java
```

### 5.2 Key Services

| Service | Responsibility |
|---------|---------------|
| `AuthService` | Login, token generation (access 15min / refresh 7days), refresh flow |
| `VacancyService` | CRUD for job vacancies, scheduling auto-expiry |
| `SubmissionService` | Job application submissions, status management |
| `ContactMessageService` | Service inquiry form storage |
| `VacancyInquiryService` | Vacancy inquiry form storage |
| `ClientService` | Partner client CRUD with featured limit (max 8) |
| `GuardingSiteService` | Partner project/site CRUD with tier limits per category |
| `SecuritySystemClientService` | CNT合作客戶 CRUD |
| `AppreciationLetterService` | 客戶嘉許信 CRUD |
| `MinioService` | File upload, public URL (`/api/files/{key}`), presigned URLs |
| `RateLimitService` | Global: 3 per 5min / Per-vacancy: 2 per 1min / Contact: global only |
| `AuditLogService` | Records admin actions (CREATE/UPDATE/DELETE) with IP |

### 5.3 Security Configuration

**Public endpoints** (`permitAll`):
```
/api/auth/**
/api/vacancies/**
/api/education-levels
/api/submissions
/api/contact
/api/vacancy-inquiries
/api/clients/**
/api/projects/**
/api/files/**
/api/security-system-clients
/api/appreciation-letters
/actuator/health
```

**Protected endpoints**: `/api/admin/**` requires valid JWT

**CORS**: `*` origins allowed (dev-friendly)

---

## 6. Frontend Architecture

### 6.1 App Router Structure

```
src/app/
├── [locale]/                       # i18n routing (zh/cn/en)
│   ├── layout.tsx                  # Root layout with I18nProvider
│   ├── page.tsx                    # Homepage (Hero + About + Services + WhyUs + Clients + Contact)
│   ├── about/page.tsx              # About page with appreciation letters
│   ├── careers/page.tsx            # Job vacancies listing
│   ├── clients/page.tsx            # Client showcase (clients + projects tabs)
│   ├── contact/page.tsx            # Contact page with inquiry form + map
│   └── services/page.tsx           # Services tabs page
│
├── admin/                          # Admin panel (protected layout)
│   ├── layout.tsx                  # Auth check + top nav bar
│   ├── login/page.tsx              # Admin login form
│   ├── dashboard/page.tsx          # Stats cards + charts
│   ├── vacancies/                  # Job vacancy CRUD
│   ├── submissions/page.tsx        # Application review
│   ├── inquiries/page.tsx          # Service inquiries
│   ├── vacancy-inquiries/page.tsx  # Vacancy inquiries
│   ├── clients/                    # Partner client CRUD
│   ├── projects/                   # Guarding site/project CRUD
│   ├── security-system-clients/    # CNT client CRUD
│   ├── appreciation-letters/       # Appreciation letter CRUD
│   └── tier-limits/page.tsx        # Featured limit config
│
└── layout.tsx                      # Root layout (metadata)
```

### 6.2 Key Components

| Component | Purpose |
|-----------|---------|
| `HeroCarousel.tsx` | Homepage carousel with 4 slides, autoplay 5s |
| `AboutSection.tsx` | Homepage about section with stats |
| `ServicesTabs.tsx` | Services page with 9 tabs + CNT logo grid |
| `ClientShowcase.tsx` | Clients/projects showcase with category filters + district sub-filters |
| `VacanciesSection.tsx` | Job listing with filters + apply dialog |
| `VacancyApplyDialog.tsx` | Job application form (name, phone, email, license, etc.) |
| `GetInTouch.tsx` | Contact section with inquiry form + map |
| `Header.tsx` | Fixed navbar with locale switcher |
| `Footer.tsx` | Footer with links + copyright |

### 6.3 State Management

- **Auth**: Zustand store (`useAuthStore`) with `token`, `refreshToken`, `isAuthenticated`, `login`, `logout`, `refresh`, `hydrate`
- **API**: Axios instance with request interceptor (attaches JWT) and response interceptor (401 → refresh → redirect to `/admin/login` if on admin page)

### 6.4 i18n

- 3 locales: `zh` (Traditional Chinese, default), `cn` (Simplified Chinese), `en`
- Hard-coded translations in `src/lib/i18n.ts` (~768 lines)
- Locale prefix in URL: `/{locale}/about`, `/{locale}/services`
- `middleware.ts` auto-redirects missing locale to default (`zh`)

---

## 7. Database Schema

### 7.1 Flyway Migrations

| Migration | Description |
|-----------|-------------|
| **V1** `init_schema.sql` | Creates all core tables: vacancies, applicant_submissions, admin_users, audit_log, districts, security_guard_types, education_levels, clients, guarding_sites, contact_messages |
| **V2** `expand_site_categories.sql` | Added categories to guarding_sites |
| **V3** `add_sub_category_and_revert_category_expansion.sql` | Added sub_category, restructured category logic |
| **V4** `add_security_system_clients.sql` | New `security_system_clients` table for CNT合作客戶 |
| **V5** `add_appreciation_letters.sql` | New `appreciation_letters` table (date, image_key, display_order, is_active) |

### 7.2 Key Tables

| Table | Purpose |
|-------|---------|
| `vacancies` | Job postings with salary, district, guard type, requirements |
| `applicant_submissions` | Job applications linked to vacancies |
| `guarding_sites` | Partner projects/sites with category, district, sub_category |
| `clients` | Partner company logos (featured max 8 enforced) |
| `security_system_clients` | CNT Alarm System partner logos |
| `appreciation_letters` | Client appreciation letters with dates |
| `contact_messages` | Service inquiry form submissions |
| `vacancy_inquiries` | Vacancy inquiry form submissions |
| `audit_log` | Admin action audit trail |
| `tier_limits` | Per-category featured limit config (default 9) |

---

## 8. API Overview

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vacancies` | List active vacancies |
| GET | `/api/vacancies/{id}` | Vacancy detail |
| GET | `/api/vacancies/districts` | District list |
| GET | `/api/vacancies/guard-types` | Guard type list |
| GET | `/api/education-levels` | Education levels |
| POST | `/api/submissions` | Apply for a job |
| POST | `/api/contact` | Service inquiry |
| POST | `/api/vacancy-inquiries` | Vacancy inquiry |
| GET | `/api/clients` | Partner clients |
| GET | `/api/projects` | Partner projects (filterable by category/district) |
| GET | `/api/security-system-clients` | CNT clients |
| GET | `/api/appreciation-letters` | Appreciation letters |
| GET | `/api/files/{*objectName}` | Serve MinIO object |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/refresh` | Refresh token |
| GET/POST/PUT/DELETE | `/api/admin/vacancies` | Vacancy CRUD |
| GET/PUT/DELETE | `/api/admin/submissions` | Application review |
| GET/DELETE | `/api/admin/inquiries` | Contact inquiries |
| GET/DELETE | `/api/admin/vacancy-inquiries` | Vacancy inquiries |
| GET/POST/PUT/DELETE | `/api/admin/clients` | Client CRUD |
| GET/POST/PUT/DELETE | `/api/admin/projects` | Project/site CRUD |
| GET/POST/PUT/DELETE | `/api/admin/security-system-clients` | CNT client CRUD |
| GET/POST/PUT/DELETE | `/api/admin/appreciation-letters` | Appreciation letter CRUD |
| GET/PUT | `/api/admin/tier-limits` | Tier limit config |
| POST | `/api/admin/upload` | Image upload to MinIO |
| GET | `/api/dashboard` | Dashboard statistics |

---

## 9. Authentication Flow

1. **Login**: `POST /api/auth/login` → returns `{ accessToken, refreshToken }`
2. **Storage**: Access token in `localStorage`, refresh token in `localStorage`
3. **API requests**: Axios interceptor attaches `Authorization: Bearer {token}`
4. **401 handling**: Attempts refresh via `POST /api/auth/refresh`. If refresh fails and user is on `/admin/*`, redirects to `/admin/login`
5. **Token expiry**: Access token = 15 minutes, Refresh token = 7 days
6. **Admin layout**: Checks `isAuthenticated` from Zustand store, auto-redirects if not logged in

---

## 10. File Upload Flow

1. Admin selects image in form → frontend calls `compressImage()`
2. Uploads via `POST /api/admin/upload` with `folder` param (e.g., `clients`, `sites`, `security-system-clients`, `appreciation-letters`)
3. Backend stores in MinIO with path: `{folder}/{uuid}-{filename}`
4. Returns `{ imageKey: "folder/uuid-filename.png" }`
5. Entity stores `imageKey`; response DTO converts to `imageUrl` via `minioService.getPublicUrl()` → `/api/files/{imageKey}`
6. Frontend displays via `/api/files/{imageKey}` which streams bytes from MinIO

---

## 11. Environment Variables

### `.env.example`

```bash
# Database
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-db-password

# Vault
VAULT_ENABLED=true
VAULT_ADDR=http://localhost:8200
VAULT_TOKEN=dev-token

# MinIO
MINIO_ENDPOINT=http://localhost:9000
MINIO_EXTERNAL_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=security-co

# JWT
JWT_SECRET=change-me-to-a-long-random-secret-key-min-64-characters-long-please
```

---

## 12. Development Commands

### Backend
```bash
cd backend
mvn spring-boot:run        # Start dev server on :8080
mvn compile                # Type check / compile
```

### Frontend
```bash
cd frontend
npm run dev                # Start dev server on :3000
npx tsc --noEmit           # Type check
npm run build              # Production build
```

### Docker
```bash
# Infrastructure only (DB + MinIO + Vault + Nginx)
docker compose -f docker-compose.infra.yml up -d

# Full stack (everything)
docker compose up -d
```

---

## 13. Security Precautions

### 13.1 Authentication & Authorization

- **JWT Token-based Auth**: Stateless authentication using signed JWT access tokens
  - **Access Token**: 15 minutes expiry (short-lived to limit exposure window)
  - **Refresh Token**: 7 days expiry (stored alongside access token in localStorage)
  - **Token Format**: `Authorization: Bearer <token>` header on every admin request
  - **Algorithm**: HS256 with a minimum 64-character secret key
- **Spring Security Filter Chain**: All `/api/admin/**` endpoints are protected; public endpoints explicitly whitelisted via `SecurityFilterChain`
- **Password Hashing**: Admin passwords stored with **BCrypt** (via Spring Security `PasswordEncoder`)

### 13.2 Secret Management

- **HashiCorp Vault**: JWT signing secret is **not hardcoded** in `application.yml`
  - Stored in Vault at path `secret/jwt`
  - Retrieved at runtime via Vault Java driver
  - Dev mode uses `VAULT_TOKEN=dev-token`; production should use AppRole or Kubernetes auth
- **Environment Isolation**: Database credentials, MinIO keys, and Vault address are injected via environment variables (`.env` file)

### 13.3 Rate Limiting

In-memory `ConcurrentHashMap`-based rate limiter to prevent abuse:

| Scope | Limit | Window | Key |
|-------|-------|--------|-----|
| **Global (per IP)** | 3 requests | 5 minutes | Client IP address |
| **Per Vacancy (per IP)** | 2 requests | 1 minute | `IP:vacancyId` |
| **Contact Inquiries** | Global limit only | — | Client IP address |

- Resets on backend restart (stateless; suitable for single-instance deployment)
- Returns `429 Too Many Requests` when exceeded

### 13.4 Input Validation & SQL Injection Prevention

- **Bean Validation**: All request DTOs use Jakarta `@Valid` with constraints (`@NotBlank`, `@Size`, `@Email`, etc.)
- **Parameterized Queries**: All database access through Spring Data JPA — no raw SQL strings concatenation
- **XSS Mitigation**: Frontend renders user-generated content via React's default escaping (no `dangerouslySetInnerHTML` for user data)

### 13.5 File Upload Security

- **Image Compression**: Frontend compresses all uploaded images before sending (`compressImage()` helper)
- **Server-Side Upload**: Files go through authenticated `POST /api/admin/upload` only (no direct-to-MinIO from browser)
- **UUID Filename**: Uploaded files are renamed with UUID to prevent path traversal and overwrite attacks: `{folder}/{uuid}-{originalFilename}`
- **Public Read-Only**: Public file access is read-only via `GET /api/files/{objectName}`; write access requires admin JWT

### 13.6 Audit Logging

- **Admin Action Tracking**: Every CREATE / UPDATE / DELETE action in the admin panel is logged to the `audit_log` table
- **Logged Fields**: Action type, entity type, entity ID, admin username, timestamp, client IP address
- **Purpose**: Accountability and forensic analysis of admin changes

### 13.7 CORS & Network

- **CORS**: Configured in `SecurityConfig.java` with `*` origins for development flexibility (production should restrict to actual domains)
- **Nginx Reverse Proxy**: All external traffic goes through Nginx, which proxies to backend/frontend internally — backend and frontend containers are not directly exposed to the public internet in production setups
- **Actuator**: Only `/actuator/health` is public; other actuator endpoints should be secured in production

### 13.8 Frontend Security

- **Auth Route Guard**: Admin layout checks `isAuthenticated` from Zustand store; unauthenticated users are redirected to `/admin/login`
- **401 Interceptor**: Axios response interceptor catches 401 errors, attempts token refresh, and only redirects to login if the user is on an `/admin/*` route
- **No Sensitive Data in LocalStorage beyond tokens**: Refresh token is the only persistent credential stored

### 13.9 Deployment Security Notes

- **Docker Secrets**: Production should mount secrets via Docker Secrets or Kubernetes Secrets instead of plain `.env` files
- **HTTPS**: Production Nginx should terminate TLS with valid certificates
- **Vault Production Mode**: Disable Vault dev mode; enable TLS, seal/unseal workflow, and proper authentication backends
