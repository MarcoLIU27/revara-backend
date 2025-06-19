# Docker Deployment Guide

This project has Docker support configured for easy containerized deployment.

## File Description

- `Dockerfile` - Multi-stage Docker image configuration
- `docker-compose.yml` - Complete service stack including application and database
- `.dockerignore` - Optimization file for Docker build process

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Using Dockerfile Only

1. **Build image**
   ```bash
   docker build -t revara-backend .
   ```

2. **Run container**
   ```bash
   docker run -p 6000:6000 --env-file .env revara-backend
   ```

## Environment Variables

Before running, ensure the following environment variables are set:

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - JWT signing key

### Optional Environment Variables
- `PORT` - Application port (default: 6000)
- `NODE_ENV` - Runtime environment (production/development)
- `APP_ENV` - Application environment
- `ORIGIN` - Allowed CORS origin

## Database Migration

For first-time setup, database migration is required: