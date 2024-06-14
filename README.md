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

### Start the server

Spins up a docker container with redis, SQLite and a NestJS server.

```bash
docker-compose up
```
