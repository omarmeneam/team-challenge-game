//index.js
require('dotenv').config();
console.log('SUPABASE_URL from .env:', process.env.SUPABASE_URL);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const questionRoutes = require('./routes/questionRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/questions', questionRoutes);
app.get('/env-test', (req, res) => {
  res.json({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_KEY });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
// This code initializes an Express server, sets up CORS and JSON parsing middleware,
// and defines routes for teams, players, and questions. It listens on a specified port and logs a message when the server is running.