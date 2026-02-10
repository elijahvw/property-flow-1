# PropertyFlow - Property Management Platform

## Overview
PropertyFlow is a full-stack property management application built with React (Vite) frontend and Express.js backend. It helps landlords manage properties, screen tenants, and collect rent with AI-powered document analysis.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite, with Tailwind CSS and shadcn/ui components
- **Backend**: Express 5 embedded as Vite plugin in dev mode, standalone Node.js server in production
- **Database**: PostgreSQL (Replit built-in Neon-backed)
- **Auth**: JWT-based authentication with bcryptjs password hashing
- **Package Manager**: pnpm

## Directory Structure
```
client/          - React frontend (pages, components, hooks, contexts)
server/          - Express backend (routes, middleware, db)
shared/          - Shared types/utilities between client and server
public/          - Static assets
dist/            - Build output (spa/ for frontend, server/ for backend)
```

## Key Configuration
- **Dev server**: Vite on port 5000 (0.0.0.0), Express mounted as Vite middleware plugin
- **Production**: `pnpm run build` then `node dist/server/production.mjs` on PORT 5000
- **Database**: Uses DATABASE_URL env var (auto-provided by Replit)
- **Environment Variables**: JWT_SECRET, VITE_API_URL=/api

## Recent Changes
- 2026-02-10: Initial Replit setup - configured Vite for port 5000, fixed crypto import in auth.ts, initialized PostgreSQL database

## User Preferences
- (none recorded yet)
