---
description: Repository Information Overview
alwaysApply: true
---

# Property Flow Information

## Summary
**Property Flow** is a full-stack multi-tenant property management SaaS platform. It features an **Express** backend and a **React SPA** frontend, built with **TypeScript**, **Vite**, and **TailwindCSS**. The application follows a "shared database, isolated schema" approach, where all data is segmented by `company_id`. It utilizes a serverless architecture on **AWS**, leveraging **S3** for frontend hosting, **Lambda** for the API, and **RDS (PostgreSQL)** for persistence.

## Structure
- **[./client/](./client/)**: React SPA frontend with pages, components, and state management.
- **[./server/](./server/)**: Express backend with modular routes and middleware.
- **[./shared/](./shared/)**: Shared types and utility functions.
- **[./terraform/](./terraform/)**: Infrastructure as Code for AWS resources.
- **[./public/](./public/)**: Static assets for the frontend.

## Language & Runtime
**Language**: TypeScript  
**Version**: Node.js 22.x  
**Build System**: Vite  
**Package Manager**: pnpm (v10.14.0)

## Dependencies
**Main Dependencies**:
- **express**: Backend web framework.
- **pg**: PostgreSQL client.
- **jsonwebtoken**: JWT implementation for auth.
- **bcryptjs**: Password hashing.
- **zod**: Schema validation.
- **serverless-http**: Middleware to wrap Express for AWS Lambda.

**Development Dependencies**:
- **react**: UI library.
- **react-router-dom**: SPA routing.
- **tailwindcss**: Utility-first CSS framework.
- **vitest**: Testing framework.
- **terraform**: Infrastructure management.

## Build & Installation
```bash
# Install dependencies
pnpm install

# Build frontend and backend
pnpm build

# Create AWS Lambda deployment package
pnpm build:lambda
```

## Docker

**Dockerfile**: [./Dockerfile](./Dockerfile)
**Configuration**: Multi-stage build for production optimization.

## Testing

**Framework**: Vitest
**Test Location**: Co-located with source files (`*.spec.ts`, `*.test.ts`).
**Naming Convention**: `[name].spec.ts`

**Run Command**:

```bash
pnpm test
```

## Architecture & Multi-Tenancy
- **Authentication**: JWT-based, invitation-only onboarding flow.
- **Isolation**: Every record in the database is tied to a `company_id`.
- **Infrastructure**: AWS Lambda (API Gateway), S3 (Website Hosting), RDS PostgreSQL (VPC-isolated).
