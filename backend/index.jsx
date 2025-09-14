require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const experimentsRouter = require('./routes/experiments.jsx');
// For demo purposes, using in-memory database simulation
// In production, use the PostgreSQL setup as defined in the original code

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock database for demo - replace with actual PostgreSQL in production
const mockEvents = [];
const mockDb = {
  query: async (sql, values) => {
    console.log('Mock DB Query:', sql.substring(0, 50) + '...');
    if (sql.includes('INSERT INTO events')) {
      const eventId = Math.floor(Math.random() * 10000);
      mockEvents.push({ id: eventId, values });
      return { rows: [{ id: eventId }] };
    }
    return { rows: [] };
  }
};
app.locals.db = mockDb;

app.use('/api', experimentsRouter);

const port = process.env.PORT || 4000;
app.listen(port, ()=> {
  console.log(`Experiment service listening on port ${port}`);
});
