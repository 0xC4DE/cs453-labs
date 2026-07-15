# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What was added

- `GET /api/types`
- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for listing item types & showing the type of items
- Client-side UI for deleting items
- Client-side UI for updating items

## Graduate Extension

See reflection answer #5


## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

Postgres data is persistent while in-memory is not, so that data is now stored remotely

### 2. When should you use `PUT` instead of `PATCH`?

When the item is fully replaced.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

Anything having to do with data typing of each field should be validated on both browser and server.

### 4. How does the browser client help you test the API differently than `curl` alone?

It lets me press buttons instead of crafting curl requests, which tends to be easier.

### 5. If you added an extension, what did you add and why?

I have added item_type table to the database, as well as linking it using a FKF to items. It is an optional field, so relevent endpoints only use it if needed. I added it because it was needed for the graduate extension.
