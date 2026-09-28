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
The default gateway CORS policy permits `http://localhost:5173`; override it through
the `CORS_ALLOWED_ORIGINS` environment variable for other frontend origins.

On its first start, Keycloak imports the `medlabs` realm, the public
`medlabs-web` OIDC client, and the `ADMIN`, `PATHOLOGIST`, and `LAB_TECHNICIAN`
realm roles. Create frontend users in this realm and assign their realm roles in
the Keycloak admin console. The gateway restricts `/api/admin/**` to `ADMIN`;
other API paths require a valid user token.

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
