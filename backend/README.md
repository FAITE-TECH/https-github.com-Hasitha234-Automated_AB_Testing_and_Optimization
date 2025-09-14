# AB Experiments Backend

1. Copy .env.example to .env and set env vars (HMAC_SALT, HASH_SEED, DATABASE_URL).
2. Install dependencies:
   cd backend
   npm install
3. Run DB migration (see ../db/events_schema.sql)
4. Start:
   npm run dev   (for development)
   npm start     (prod)

Endpoints:
- POST /api/assign
- POST /api/kill/:experimentId  { "kill": true }
- GET /api/kill/:experimentId
- POST /api/events
