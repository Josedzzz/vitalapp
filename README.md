# 🩺 VitalApp Backend

This is the backend for **VitalApp**, an application for managing doctors, patients, medical results, and appointment schedules. It's built using **Deno**, **MongoDB Atlas**, and follows a modular architecture with controllers, services, and middlewares.

## 🚀 Requirements

- [Deno](https://deno.land/) `v2.2.7` or higher
- Access to a MongoDB Atlas database
- A `.env` file with your environment variables (see below)

## ⚙️ Environment Variables

Create a `.env` file at the root of the project with the following content:

```env
MONGO_URI=your_mongo_connection_uri
JWT_SECRET=your_secret_key
```

## Run the Server

To run the local development server with automatic reload:

```bash
deno run --watch --allow-env --allow-sys --allow-net --allow-read --allow-write src/app.ts

```

## 🧪 Run Tests

To run the project's unit tests:

```bash
deno test --allow-env --allow-sys --allow-net --allow-read

```
