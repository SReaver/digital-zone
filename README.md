<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Project Overview

Digital Zone is a real-time data aggregation service for digital products. It collects, processes, and normalizes pricing and availability data from multiple providers, offering a unified API for accessing digital product information.

## Architecture

The project is structured as a microservices architecture using NestJS:

### Services
1. **Digital Zone (Port 3000)**
   - Main aggregation service
   - Handles data normalization and API endpoints
   - Connected to main products database

2. **Provider Services**
   - Provider One (Port 3001)
   - Provider Two (Port 3002)
   - Provider Three (Port 3003)
   - Each simulates a third-party data source

### Database
- PostgreSQL instance with separate databases for each service
- Main products database for aggregated data
- Individual provider databases for source data

## Getting Started

1. **Prerequisites**
   ```bash
   - Node.js 20+
   - Docker and Docker Compose
   - npm
   ```

2. **Installation**
*You can omit this step if you run docker compose*
   ```bash
   # Install dependencies
   npm install

   # Generate Prisma clients
   npm run prisma:generate
   ```

3. **Running the Services**
   ```bash
   # Start all services using Docker Compose
   docker-compose up

   # Or start individual services
   docker-compose up digital-zone
   docker-compose up provider-one
   ```

4. **Environment Setup**
   Each service uses the following environment variables:
   ```
   POSTGRES_HOST=digital-zone-db
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=[service-specific-db]
   ```

## API Documentation

### Main Endpoints

```
GET /products
  Query Parameters:
  - provider: Filter by provider
  - minPrice: Minimum price
  - maxPrice: Maximum price
  - available: Filter by availability

GET /products/:id
  Returns detailed product information

GET /products/changes
  Query Parameters:
  - since: ISO date string
  - provider: Filter by provider
```

## Security

This project uses an API key for securing endpoints. The API key must be included in the request headers:

```
x-api-key: your-api-key
```

Ensure that your API key is kept secret and not exposed in client-side code or public repositories. The API key should be stored in an environment variable named `API_KEY`:

```
API_KEY=your-api-key
```

When using Docker Compose, you can set the API key in the `docker-compose.yml` file:

```yaml
services:
  digital-zone:
    environment:
      - API_KEY=your-api-key
  # ...other services...
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```