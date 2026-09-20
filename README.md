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
- the API service
- PostgreSQL
- Keycloak for identity/OIDC

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
