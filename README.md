# Express Boilerplate

## Description

Basic conf for an express server with prisma and docker and a postgresql database, using typescript.

## Installation Instructions

1. Clone the repository
2. run

```bash
docker compose up -d
```

3. run

```bash
npx prisma db push
```

## generate a secret key

```bash
openssl rand -base64 24
```
