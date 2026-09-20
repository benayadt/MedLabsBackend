# MedLabs Backend Architecture

## Overview

MedLabs needs a backend that can run either in a local lab environment or in AWS, without requiring a major code rewrite. The architecture should stay small, understandable, and easy to operate while still being portable.

## Architecture goals

- portability between on-prem and cloud environments
- simple deployment model for a small team
- support for healthcare workflows and auditing requirements
- separation of synchronous API work from asynchronous processing
- easy migration path to AWS managed services later

## High-level components

### 1. API service

The main backend service exposes REST endpoints for:

- patient management
- biopsy intake and tracking
- report creation and review
- approval workflows
- role-based authorization
- audit log access

Responsible for the synchronous path of the application.

### 2. Background worker

Processes asynchronous jobs such as:

- PDF generation
- notification delivery
- report export
- indexing or downstream integration tasks

This service should be loosely coupled from the API to avoid blocking user requests.

### 3. Database layer

Use PostgreSQL as the primary transactional database.

Primary domains include:

- patients
- biopsies
- reports
- users and roles
- audit events
- metadata and document references

### 4. Object storage

Use object storage for:

- PDF files
- generated reports
- attachments
- images and supporting evidence

For on-prem deployment, MinIO is recommended. For AWS, S3 is the target service.

### 5. Messaging layer

Use RabbitMQ locally or SQS in AWS for asynchronous communication between the API and worker services. This allows the application to remain decoupled and improves reliability for jobs that do not need user interaction.

## Recommended deployment topology

### Small on-prem deployment

A single VM or small server may host:

- API container
- Worker container
- PostgreSQL container
- MinIO container
- RabbitMQ container

This is the simplest deployment style for early-stage adoption.

### AWS deployment

The same application can move to:

- ECS Fargate for containers
- App Runner for simpler service hosting
- RDS for PostgreSQL
- S3 for object storage
- SQS or Amazon MQ for messaging
- Cognito or another portable identity provider
- CloudWatch for logs and observability

## Infrastructure principles

- keep the application logic cloud-agnostic
- use environment variables and secrets for configuration
- avoid vendor-specific assumptions in core business code
- standardize service health checks and logging
- keep the system stateless where possible

## Security expectations

- strong authentication and role-based access control
- audit trails for report changes and approvals
- encrypted connections to the database and storage systems
- secret management outside source control
- access controls around patient and lab data

## Operational model

This architecture intentionally avoids Kubernetes during the early phase unless scale or operational needs justify it.

The preferred operational progression is:

1. Docker Compose for local and on-prem deployment
2. managed container service in AWS
3. optional orchestration evolution later if required

## Decision summary

The backend should be designed as a set of containerized services with a small operational footprint and strong portability. The application should be deployable on-prem with Docker Compose and migrated to AWS-managed services without rewriting the business logic.
