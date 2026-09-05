# MingleMart

A full-stack e-commerce application: a **Spring Modulith** backend on Java 21 and a
**React 19** storefront rendered by a hybrid SSR/CSR Express server.

> The repository directory is still named `ZCommerce`. The application itself was
> renamed to MingleMart — the Java packages, the Maven artifact and the database all
> use the new name, while a few frontend labels (the `index.html` title, the
> `package.json` name) still carry the old one.

---

## Table of contents

- [Stack](#stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Backend architecture](#backend-architecture)
- [Frontend architecture](#frontend-architecture)
- [Authentication](#authentication)
- [API](#api)
- [Database](#database)
- [Testing](#testing)
- [Docker](#docker)
- [Project status](#project-status)

---

## Stack

### Backend

| Concern | Choice |
| --- | --- |
| Language / runtime | Java 21 |
| Framework | Spring Boot 4.1, Spring Modulith 2.1 |
| Web | Spring MVC (`spring-boot-starter-webmvc`) |
| Persistence | Spring Data JPA + Hibernate, PostgreSQL 18 |
| Migrations | Flyway (`V1`–`V8`, plus a repeatable demo seed) |
| Security | Spring Security, BCrypt, Nimbus JWT (`spring-security-oauth2-jose`) |
| Cache | Redis 8, through an explicit `RedisStore` (no cache annotations) |
| Mail | `spring-boot-starter-mail` behind `SmtpMailSender` |
| Build | Maven (wrapper 3.3.4 → Maven 3.9.16) |
| Ops | Actuator (`health`, `info`, `modulith`), Docker Compose Support |

### Frontend

| Concern | Choice |
| --- | --- |
| Language | TypeScript 6 |
| UI | React 19, React Router 7, Tailwind CSS 4, shadcn/ui on Base UI |
| State | Redux Toolkit + RTK Query, `redux-persist` |
| Build | Vite 8 (`@vitejs/plugin-react-swc`) |
| Server | Express 5, run through `tsx` |
| Extras | `motion`, `embla-carousel`, `react-hook-form`, `react-toastify`, `@react-oauth/google` |

---

## Repository layout

```
.
├── backend/                       Spring Modulith API
│   ├── compose.yaml               Postgres + Redis (+ optional app under the `full` profile)
│   ├── Dockerfile                 Two-stage build, layered jar, non-root runtime
│   └── src/main/
│       ├── java/com/minglemart/
│       │   ├── MinglemartApplication.java
│       │   ├── jobs/              Scheduled triggers (notification outbox dispatch)
│       │   ├── modules/           One Modulith module per bounded context
│       │   │   ├── agent/         (stub)
│       │   │   ├── cart/          (stub)
│       │   │   ├── catalog/       Products, variants, categories, deals, offers, reviews
│       │   │   ├── identity/      Users, sessions, tokens, OAuth, profiles, addresses
│       │   │   ├── inventory/     (stub)
│       │   │   ├── notification/  Outbox rows + dispatch service
│       │   │   ├── order/         (stub)
│       │   │   └── payment/       (stub)
│       │   └── shared/            OPEN module: contracts, base classes, infra, config
│       └── resources/
│           ├── application.properties
│           ├── db/migration/      V1__user … V8__notification
│           ├── db/seed/           R__demo_catalogue.sql (194 products, 581 reviews)
│           └── templates/Auth/    Transactional email templates
└── frontend/                      React storefront (SSR + CSR)
    ├── index.html                 Pre-paint theme script, SSR mount points
    ├── vite.config.ts
    └── src/
        ├── server/                dev.ts (Vite middleware), prod.ts (LRU-cached SSR)
        ├── entry-client.tsx       Hydration
        ├── entry-server.tsx       Static router + route-declared prefetch
        ├── routes/                Root route table
        ├── modules/               landing, auth, customer, profile, admin, company, errors
        ├── common/                UI kit, layouts, catalog/deals/shop components
        ├── lib/                   Handlers (RTK Query), hooks, guards, models, utils
        └── store/                 Redux store and slices
```

---

## Getting started

**Prerequisites:** JDK 21+, Node 20+, Docker (for Postgres and Redis).

### 1. Backend

```bash
cd backend
cp .env.example .env          # then set MINGLEMART_TOKEN_SECRET (at least 32 bytes)
./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
```

Spring's Docker Compose Support reads `compose.yaml`, starts Postgres and Redis, and
injects the connection details — no manual database setup, no JDBC URL to configure.
Flyway then applies `V1`–`V8` and seeds the demo catalogue on first boot.

The API listens on **http://localhost:8080**; health is at `/actuator/health`.

For outgoing mail in development, run a local SMTP sink:

```bash
docker run -p 1025:1025 -p 8025:8025 axllent/mailpit    # UI on :8025
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The SSR dev server listens on **http://localhost:5173**, with Vite HMR sharing the same
port.

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | SSR dev server with HMR (`src/server/dev.ts`) |
| `npm run build` | Typecheck, then build the client and SSR bundles |
| `npm run start` | Serve the production build (`src/server/prod.ts`) |
| `npm run preview` | `build` followed by `start` |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | ESLint |
| `./mvnw spring-boot:run` | Backend with Compose-managed dependencies |
| `./mvnw test` | Backend unit + integration tests |

---

## Configuration

Both sides ship a documented `.env.example`. Copy it to `.env`; neither `.env` is
committed.

### `backend/.env`

Spring loads this file directly through `spring.config.import` — no dotenv library.
Real environment variables take precedence over it.

| Variable | Purpose |
| --- | --- |
| `MINGLEMART_TOKEN_SECRET` | HMAC key for access-token JWTs. **Must be at least 32 bytes** or the app refuses to start. |
| `GOOGLE_CLIENT_ID` | Checked as the `aud` claim of every Google ID token. Unset rejects every Google sign-in. |
| `FRONTEND_URL` | Base URL for emailed links, and the default allowed CORS origin. |
| `CORS_ALLOWED_ORIGINS` | Comma-separated exact origins. A credentialed request cannot use a wildcard. |
| `HTTP_LOG_REQUESTS` | One log line per request (method, path, status, duration). Off by default. |
| `MAIL_*` | SMTP host/port/credentials and the `From` identity. |
| `spring.datasource.*`, `REDIS_*` | Only needed when pointing at infrastructure you manage yourself. |

Token lifetimes live in `application.properties`: access `15m`, refresh `30d`.

### `frontend/.env`

Only `VITE_`-prefixed values reach client code, and they are **inlined into the
bundle** — nothing secret belongs here.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API base, no trailing slash (default `http://localhost:8080/api`). |
| `VITE_GOOGLE_CLIENT_ID` | Must match `GOOGLE_CLIENT_ID` on the backend. |
| `PORT` | Port for the production SSR server (`prod.ts`); dev is fixed at 5173. |

---

## Backend architecture

Modules are declared explicitly with `@ApplicationModule` on `package-info.java`
(`spring.modulith.detection-strategy=explicitly-annotated`), so they can nest freely
rather than being limited to direct sub-packages.

Every feature module declares `allowedDependencies = "shared"`. **No module may import
another.** Cross-module collaboration happens through interfaces in `shared/contracts`
— `CatalogQuery`, `CartOperations`, `OrderOperations`, `PaymentOperations`,
`StockLedger`, `UserDirectory`, `AuthNotifications`, `NotificationDispatch`,
`ReviewOperations`, `AccessTokenVerifier` — and the rule is enforced by
`ModularityTests` in the test suite.

`shared` is an `OPEN` module holding what everything needs:

- `common/` — `ApiResponse`, `Money`, `ActorRef`, `AuthCookies`
- `domain/` — `BaseModel`, `SoftDeletableModel`, `BaseRepository`, `BaseController`,
  `BaseDataService`, `BaseIntegrationService`, `BaseFactory`
- `config/` — `SecurityConfig`, `SecurityHandler`, `RequestLogConfig`
- `filters/` — `AccessTokenFilter`, `RequestLogFilter`
- `infra/` — `RedisStore`, `SmtpMailSender`, `TemplateRenderer`
- `enums/` — shared vocabulary (`DealKind`, `DiscountType`, `OfferScope`, `TokenType`, …)

Two decisions worth knowing:

- **Caching fails open.** `RedisStore` catches its own failures and returns a miss, so a
  Redis outage makes storefront reads slower rather than broken. Redis is deliberately
  excluded from the health verdict for the same reason.
- **Notifications are an outbox.** Services write rows; `NotificationDispatchJob` claims
  a batch, locks it, renders the template and sends. It is safe to run on several
  instances, and mail is excluded from `/actuator/health` so an unreachable relay delays
  delivery instead of triggering restarts.

---

## Frontend architecture

### Hybrid SSR / CSR

`entry-server.tsx` runs the route guard, builds a static router, seeds the Redux store
from the request cookies, executes any `prefetch` thunks the matched routes declared,
then `renderToString`s the tree. The serialised state is injected into
`<!--app-state-->`, and `entry-client.tsx` hydrates against it.

Prefetch is declared on the route itself:

```tsx
handle: { prefetch: () => [catalogHandlers.endpoints.getLanding.initiate()] }
```

RTK Query fetches from an effect and `renderToString` runs no effects — without that
declaration the server would emit every page in its loading state.

`prod.ts` adds an LRU page cache (500 entries / 64 MB / 60 s TTL) used **only for
anonymous requests**. It parses the cookie header rather than substring-matching it, so
a user who deletes the readable `session` cookie while `access` still authenticates them
is not served an anonymous render.

The theme is applied by an inline script in `index.html` before first paint, reading
`redux-persist`'s `gen` slice straight out of `localStorage`, so a themed background is
never repainted. That script also adds a `js` class — reveal animations hide their
content and must not engage for no-JS visitors.

### Module structure

Each module under `src/modules/` owns its `routes.tsx`, `layout.tsx`, `pages/` and
`components/`:

| Module | Routes |
| --- | --- |
| `landing` | `/`, `/shop`, `/deals` (guest-facing storefront) |
| `auth` | `/authenticate/{login, sign-up, account-verify, email-verify, password-forgot, password-confirm, password-change}` |
| `company` | `/about`, `/careers`, `/privacy`, `/terms` — public siblings of the audience modules, so the guard needs no exception for them |
| `customer` | `/user/:publicUserId/{, shop, deals, cart, orders}` |
| `profile` | `/profile/{, security, privacy, shipping, billing}` |
| `admin` | `/admin/:publicUserId/{, dashboard, users, products}` |
| `errors` | `/unauthorized` (403) and a `*` catch-all (404), both with real status codes |

Route access is described by `RoutePolicy` (`lib/auth/policy.ts`): `public`, `guest`, or
`protected(roles, { requireVerified, owner })`. The `owner` flag ties a route's
`:publicUserId` segment to the session's own, so a crafted URL cannot render another
user's shell. The same policy runs server-side in `serverGuard.ts` and client-side in
`middleware.ts`.

Only the `gen` slice is persisted. Auth state deliberately is not — `localStorage` has
no expiry, and a persisted `isAuthenticated` would outlive the cookies and leave the UI
insisting you are signed in while every request 401s.

---

## Authentication

Three cookies, each with a distinct job:

| Cookie | Contents | Flags |
| --- | --- | --- |
| `access` | Access JWT, 15 minutes | HttpOnly |
| `refresh` | Opaque rolling token — a `sessions` row, and therefore revocable | HttpOnly, scoped to `/api/auth` |
| `session` | Routing hints the frontend reads; grants nothing | readable |

The access token is short-lived and cannot be revoked before it expires; revocation is
the refresh token's job, which is why it is an opaque database row rather than signed
data. Rotating `MINGLEMART_TOKEN_SECRET` invalidates outstanding access tokens while
refresh tokens survive.

`AccessTokenFilter` runs before `UsernamePasswordAuthenticationFilter`; the chain is
stateless, with CSRF, form login and HTTP Basic all disabled. On the client,
`baseHandler.ts` renews the session once on a 401 and replays the request — skipped for
`/auth/*`, where a 401 *is* the answer, and skipped on the server, which cannot hand
rotated cookies back to the browser.

Email verification and password reset use single-use `tokens` rows: `consume()` returns
`false` for an already-spent token, and issuing a new one invalidates outstanding ones of
the same kind.

Also supported: Google sign-in (ID token verified against `GOOGLE_CLIENT_ID` as `aud`),
BCrypt password hashing, and hashed token storage via `TokenHasher`.

---

## API

All responses are wrapped in `ApiResponse<T>`. Base path: `/api`.

### Public — `/api/auth/**`

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/sign-up` | Register |
| `POST` | `/api/auth/sign-in` | Sign in |
| `POST` | `/api/auth/sign-out` | Sign out and revoke the session |
| `POST` | `/api/auth/google` | Google ID-token sign-in |
| `POST` | `/api/auth/refresh` | Rotate the refresh token, mint a new access token |
| `POST` | `/api/auth/session` | Resolve the current `AuthenticatedUser` |
| `POST` | `/api/auth/email-verify` | Consume an email-verification token |
| `POST` | `/api/auth/password-forget` | Send a reset link |
| `POST` | `/api/auth/password-reset` | Consume a reset token and set a new password |

### Public — storefront (GET only)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/landing` | Landing payload: categories, trending, deal of the day |
| `GET` | `/api/shop` | Catalogue search — `q`, `category` (repeatable), `min`, `max`, `rating`, `sort`, `page`, `size` |
| `GET` | `/api/deals` | Active deals and offers |
| `GET` | `/actuator/health` | Liveness |

### Authenticated

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/profile` | Current customer profile |
| `PATCH` | `/api/profile` | Update the current customer profile |

`/api/admin/**` and the remaining `/actuator/**` endpoints require the `ADMIN` role;
everything else requires authentication.

CORS allows only exact origins with `allowCredentials(true)` — a credentialed request
cannot be answered with a wildcard origin, which is the usual reason a "fixed" CORS
setup is still blocked.

---

## Database

PostgreSQL, `ddl-auto=validate`, schema owned entirely by Flyway — one migration per
module.

| Migration | Tables |
| --- | --- |
| `V1__user` | `roles`, `permissions`, `role_permissions`, `users`, `customer_profiles`, `oauth_accounts`, `addresses`, `sessions`, `tokens` |
| `V2__catalog` | `categories`, `products`, `product_variants`, `variant_attributes`, `product_images`, `product_reviews`, `deals`, `offers`, `offer_targets`, `offer_bundle_items` |
| `V3__inventory` | `inventory_items`, `inventory_reservations`, `stock_movements` |
| `V4__cart` | `carts`, `cart_items` |
| `V5__order` | `orders`, `order_items`, `order_addresses`, `order_status_history` |
| `V6__payment` | `payment_methods`, `payments`, `refunds`, `payment_events` |
| `V7__agent` | `conversations`, `messages`, `agent_tool_calls`, `agent_actions`, `agent_audit_log` |
| `V8__notification` | `notification_preferences`, `notifications` |

Spring Modulith's event publication registry creates its own table
(`spring.modulith.events.jdbc.schema-initialization.enabled=true`) rather than being
hand-written into a migration, which avoids drift on upgrade.

> ⚠️ `spring.flyway.locations` includes `classpath:db/seed`, which carries the
> repeatable demo catalogue. **That is development data.** Drop the second location — or
> move it into an `application-dev.properties` — before the first production deployment,
> or Flyway will happily seed production.

---

## Testing

```bash
cd backend
./mvnw test
```

- **Unit tests** (`src/test/java/com/minglemart/unit/`) cover token hashing, the cookie
  and session-handle factories, JWT issuing, the session service, notification dispatch,
  template rendering, the access-token filter, `Money`, `ActorRef` and the base classes.
- **`ModularityTests`** verifies the Modulith boundaries — it fails the build if one
  module imports another instead of going through `shared/contracts`.
- **Integration tests** (`src/test/java/com/minglemart/integration/`) use Testcontainers
  with PostgreSQL, so they need a running Docker daemon. `TestMinglemartApplication`
  starts the app against containerised dependencies for manual runs.

The frontend has no test suite yet; `npm run typecheck` and `npm run lint` are the
current gates.

---

## Docker

`compose.yaml` defines Postgres and Redis with health checks and named volumes. The
`app` service sits behind a `full` profile on purpose — Spring's Docker Compose Support
starts every service it finds in the file, so an unguarded `app` would boot a second
copy of itself in a container.

```bash
# App on the host, dependencies in Docker (the normal dev loop)
cd backend && ./mvnw spring-boot:run

# Whole stack in containers
cd backend && docker compose --profile full up --build
```

The `Dockerfile` builds in two stages: a Maven/JDK stage that packages the jar and
extracts it into its four layers, and a JRE-only runtime stage running as an
unprivileged `minglemart` user. The image ships no configuration of its own — the
datasource and `MINGLEMART_TOKEN_SECRET` have no safe defaults and are required at run
time:

```bash
docker build -t minglemart-backend backend
docker run --rm -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/minglemart \
  -e SPRING_DATASOURCE_USERNAME=minglemart \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  -e MINGLEMART_TOKEN_SECRET="$(openssl rand -base64 48)" \
  minglemart-backend
```

Tests are skipped during the image build — the integration suite drives Testcontainers,
which needs a Docker daemon an image build does not have. Run them in CI instead.

---

## Project status

**Implemented end to end**

- **Identity** — sign-up, sign-in, sign-out, refresh rotation, Google OAuth, email
  verification, password forget/reset, sessions, customer profiles, addresses, roles and
  permissions.
- **Catalog** — products, variants, attributes, images, categories, reviews and ratings,
  deals and offers, Redis-cached storefront reads (`/api/landing`, `/api/shop`,
  `/api/deals`).
- **Notifications** — outbox rows, scheduled dispatch, HTML email templates for
  verification, password reset and password-changed.
- **Frontend** — landing/shop/deals storefront, the full auth flow, company pages, the
  profile section, error pages, SSR with per-route prefetch and an anonymous page cache.

**Scaffolded — schema and contracts exist, implementation does not**

`cart`, `order`, `payment`, `inventory` and `agent` each have their Flyway migration and
a `shared/contracts` interface, but only a `package-info.java` in the module itself. The
matching frontend pages (`cart`, `orders`, and the admin dashboard/users/products
screens) are placeholders, and `PUT /api/users/me/picture` is called by the frontend but
has no controller behind it yet.
