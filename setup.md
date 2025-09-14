# Setup Instructions for Automated A/B Testing System

## Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `backend/` directory with:
   ```
   PORT=4000
   HMAC_SALT=super-secret-salt-for-hashing
   HASH_SEED=experiment-seed-2025
   DATABASE_URL=postgresql://localhost:5432/ab_testing
   ```

2. **Database Setup**
   - Install PostgreSQL if not already installed
   - Create database: `createdb ab_testing`
   - Run the schema: `psql ab_testing < db/events_schema.sql`

3. **Alternative: SQLite for Demo**
   For a quick demo without PostgreSQL, you can modify the code to use SQLite.

## Running the System

1. **Start Backend** (Terminal 1):
   ```
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```
   cd frontend
   npm run dev
   ```

## Features Implemented

✅ **A/B Testing Engine**
- Deterministic user assignment using HMAC hashing
- Configurable variant allocations
- Kill switch for stopping experiments
- Consistent assignment across sessions

✅ **Event Tracking**
- Impression tracking
- Click tracking  
- Conversion tracking
- Custom event metadata

✅ **Digital Ad Campaign Support**
- Ad creative variants
- Campaign and ad ID tracking
- Device type detection
- Geographic tracking

✅ **Frontend Integration**
- React hooks for experiment assignment
- Local storage caching
- Event logging utilities
- Context provider for state management

