# ADR 0001: Use a containerized, portable backend architecture

- Status: Accepted
- Date: 2026-09-20

## Context

MedLabs may be deployed either on-premises or in AWS, and the final location is not yet fixed. The backend must remain portable and easy to operate without introducing unnecessary infrastructure complexity.

## Decision

We will use a containerized backend architecture composed of a small set of services: API, worker, database, object storage, and optional messaging. This design can run locally via Docker Compose and later be deployed to AWS-managed services.

## Rationale

- avoids early Kubernetes complexity
- supports both on-prem and cloud deployment
- minimizes refactoring when moving between environments
- keeps the system simple enough for a small team

## Consequences

- easier deployment portability
- lower operational burden than full orchestration
- eventual move to managed cloud services remains straightforward
- may require some environment-specific wiring when moving to AWS
