# PropertyFlow - Property Management Platform

## Overview
PropertyFlow is a full-stack property management application built with React (Vite) frontend and Express.js backend. It helps landlords manage properties, screen tenants, and collect rent. Being built in vertical slices.

## Current Slice: Slice 1 — Multi-tenant foundation + RBAC
- Companies, users (Auth0-linked), company_users (roles: owner/staff/tenant), invites
- Auth0 SPA SDK on frontend, JWKS JWT verification on backend
- Role-based access control middleware
- Company scoping on all business queries

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite, with Tailwind CSS and shadcn/ui components
- **Backend**: Express 5 embedded as Vite plugin in dev mode, Lambda + API Gateway in production
- **Database**: PostgreSQL (Replit dev, RDS production)
- **Auth**: Auth0 (SPA SDK + JWKS JWT verification)
- **Infrastructure**: Terraform (Lambda, API Gateway, S3, CloudFront, RDS, VPC)
- **Package Manager**: pnpm
- **Tests**: Vitest + Supertest

## Directory Structure
```
client/              - React frontend
  contexts/          - AuthContext (Auth0 integration)
  components/        - UI components (shadcn/ui based)
  pages/             - Route pages (Dashboard, Team, SetupCompany, etc.)
  lib/               - Utilities and API client
server/              - Express backend
  db/                - Database pool, migrations
  db/migrations/     - SQL migration files
  middleware/        - Auth0 JWT verification, RBAC
  routes/            - API routes (auth, companies, invites)
  routes/__tests__/  - API tests
shared/              - Shared TypeScript types
terraform/           - AWS infrastructure (VPC, RDS, Lambda, CloudFront)
scripts/             - Deploy scripts
```

## Key Configuration
- **Dev server**: Vite on port 5000 (0.0.0.0), Express mounted as Vite middleware plugin
- **Production**: Lambda behind API Gateway, S3+CloudFront for frontend
- **Database**: Uses DATABASE_URL env var
- **Auth0**: VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE (frontend), AUTH0_DOMAIN, AUTH0_AUDIENCE (backend)

## Key Commands
- `pnpm dev` — Start development server
- `pnpm test` — Run tests
- `pnpm migrate` — Run database migrations
- `pnpm run build:lambda` — Build Lambda deployment package
- `./scripts/deploy.sh` — Full AWS deployment

## Upcoming Slices
- Slice 2: Properties/Units CRUD + occupancy
- Slice 3: Leases + Tenants
- Slice 4: Rent invoicing
- Slice 5: Maintenance requests + work orders

## Recent Changes
- 2026-02-10: Slice 1 implementation — Auth0 integration, RBAC, migration system, Terraform overhaul, tests, deploy script

## User Preferences
- Deploy to own AWS infrastructure via Terraform (not Replit publishing)
- Build in vertical slices
- Include tests and deployment scripts
