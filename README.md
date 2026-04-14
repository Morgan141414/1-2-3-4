# Saphena Platform (Unified Workspace)

Unified workspace for transfer from Team 1 to Team 2.

## Repository Structure

- `apps/saphena-web` - Angular frontend
- `services/saphena-api` - Spring Boot backend
- `services/whatsapp-bot` - Node.js WhatsApp bot service

## Quick Start (Docker)

1. Copy environment template:
   - `Copy-Item .env.example .env`
2. Start all services:
   - `docker compose up -d --build`
3. Open services:
   - Frontend: `http://localhost:4200`
   - API Swagger: `http://localhost:8080/swagger-ui/index.html`
   - API docs: `http://localhost:8080/v3/api-docs`
   - WhatsApp bot health: `http://localhost:3000/api/health`

## Service Ports

- `4200` -> `saphena-web` (nginx container port 80)
- `8080` -> `saphena-api`
- `3000` -> `whatsapp-bot`
- `5432` -> `postgres`

## Local Development (without Docker for frontend)

Run backend stack:

- `docker compose up -d postgres whatsapp-bot`
- Start API from `services/saphena-api` (Gradle)
- Start web from `apps/saphena-web`:
  - `npm install`
  - `npm start`

Frontend dev server is available at `http://localhost:4200` and proxies `/api` to `http://localhost:8080` via `proxy.conf.json`.

## Notes for Handover

- Keep each service as its own Git repository for history isolation.
- Use this root only as orchestration and onboarding entry point.
- If needed later, add CI/CD at this root for full-platform integration tests.
