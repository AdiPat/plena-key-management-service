# Plena Finance: Access Key Management Service 🔑

## Introduction

An API key management service that issues access keys and manages them to service consumers.

## Features & Specifications

- Generate access keys for users.
- Defines rate-limits for access keys per minute.
- Define access key expiry.
- Delete access key for user.
- List access keys for user.
- Retrieve plan details with access key.
- Disable key.
- Service authentication happens with a valid JWT token. The service by itself doesn't implement any form of auth.

## Setup

1. Create env file

```bash
mv .env.sample .env
```

2. Install dependencies

```bash
npm install
```

3. Install Prisma and setup DB

```bash
npm i -g prisma
npx prisma generate
npx prisma db push
```

4. [Install Redis.](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

5. Start server

```bash
npm run start:dev
```

### Start the server with Docker

Spins up a docker container with redis, SQLite and a NestJS server.

```bash
docker-compose up
```

# Run Tests

1. Unit Tests

```bash
npm run test
```

1. Integration Tests

```bash
npm run test:e2e
```
