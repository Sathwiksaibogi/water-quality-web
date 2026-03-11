# IoT Smart Water Bottle Dashboard (React + Vite)

High-end, responsive dashboard for monitoring `bottle_01/sensors` from **Firebase Realtime Database**.

This project is synced with the GitHub repo [`Sathwiksaibogi/water-quality-web`](https://github.com/Sathwiksaibogi/water-quality-web).

## Setup

### Install

```bash
npm install
```

### Firebase env vars

Create a `.env` file in the project root (same folder as `package.json`). You can copy from `env.example`:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=... # optional
```

### Run

```bash
npm run dev
```

