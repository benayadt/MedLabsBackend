# MedLabsBackend

Java backend for the MedLabs platform, designed for portability between on-prem deployment and AWS.

## Recommended framework

Spring Boot is the recommended framework for this project.

Why Spring Boot:
- strong REST API support
- mature ecosystem for Java enterprise applications
- easy Docker packaging
- good fit for patient, biopsy, report, and authorization workflows
- easy migration from local Docker Compose to AWS ECS/Fargate or EC2

## Technology stack

- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL
- Flyway for schema migration
- MinIO for on-prem object storage
- S3-compatible storage in AWS
- Docker for containerization

## Project structure

- `src/main/java` – application code
- `src/main/resources` – configuration files
- `src/test/java` – tests
- `docs/` – architecture notes and ADRs
- `gateway/` – Spring Cloud Gateway (authn/authz edge service)
- `frontend/` – placeholder SPA + Nginx static hosting/reverse proxy
- `keycloak/realm/` – imported realm definition for local development
- `docker-compose.yml` – local on-prem environment
- `Dockerfile` – container definition

## Local development

```bash
mvn clean test
mvn spring-boot:run
```

## Local services with Docker Compose

```bash
docker compose up --build
```

This starts:
- Nginx at `http://localhost:8000`, serving the built frontend and reverse-proxying `/api/*` to the gateway
- the Spring Gateway at `http://localhost:8080`
- the API service, available only through the gateway
- PostgreSQL
- Keycloak for identity/OIDC

The gateway validates Keycloak JWTs and applies route authorization before forwarding
requests to the API. `/api/health` is public; `/api/admin/**` requires the Keycloak
realm role `ADMIN`; all other `/api/**` routes require an authenticated user. The API
also validates JWTs as a defense-in-depth measure.

For a browser frontend running locally, configure its API base URL as
`http://localhost:8080` and its Keycloak authority as `http://localhost:8081/realms/medlabs`.
The default gateway CORS policy permits `http://localhost:5173` and `http://localhost:3000`;
override it through the `CORS_ALLOWED_ORIGINS` environment variable for other frontend origins.

On its first start, Keycloak imports the `medlabs` realm, the confidential
`medlabs-web` OIDC client, and the `ADMIN`, `PATHOLOGIST`, and `LAB_TECHNICIAN`
realm roles. Create frontend users in this realm and assign their realm roles in
the Keycloak admin console. The gateway restricts `/api/admin/**` to `ADMIN`;
other API paths require a valid user token.

The `medlabs-web` client is confidential (has a client secret) because it is
used by the [MedLabs Next.js frontend](https://github.com/benayadt/MedLabs)'s
server-side NextAuth.js integration, which can safely hold a secret. For local
development its secret is the fixed dev-only value `medlabs-web-dev-secret`
defined in `keycloak/realm/medlabs-realm.json`; change it before any shared or
production use. See that repository's `docs/webapp/keycloak-setup.md` for the
frontend-side environment variables required to use it.

## Frontend

`frontend/` is a minimal placeholder single-page application (plain Vite +
vanilla JS). It demonstrates the intended production topology rather than
being a real product frontend:

- `npm run build` compiles the SPA into static files (`dist/`) — no
  JavaScript runtime is needed to serve them.
- The `web` Docker Compose service builds those static files and serves them
  with Nginx, which also reverse-proxies `/api/*` to the `gateway` service on
  the same origin. This is why the browser never needs CORS in production —
  the page and the API appear to come from one origin.
- For local frontend development without Docker, run `npm install && npm run
  dev` inside `frontend/`. The Vite dev server (`http://localhost:5173`)
  proxies `/api/*` to `http://localhost:8080` (the gateway), matching the
  gateway's default `CORS_ALLOWED_ORIGINS`.
- A real login flow (Authorization Code + PKCE against Keycloak) is not
  implemented in this placeholder; see `frontend/index.html` for where that
  would be added.

For a dedicated on-prem server, replace the `8000:80` port mapping with
`80:80`/`443:443` (with TLS termination in Nginx or a load balancer in front
of it) so the SPA and API are reachable at the server's standard address.

## Deployment strategy

### On-prem
- Docker Compose on a single VM or small server
- PostgreSQL container
- object storage with MinIO
- optional background worker processes

### AWS
- ECS Fargate or App Runner
- RDS PostgreSQL
- S3 for object storage
- Cognito or Keycloak-compatible auth options
- CloudWatch for logs and monitoring

## Architecture goals

- keep backend logic portable
- avoid Kubernetes until scale justifies it
- separate API work from asynchronous background processing
- support auditing and role-based access for healthcare workflows
