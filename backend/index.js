// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// team routes
const teamRoutes = require('./routes/teamRoutes');
app.use('/api/teams', teamRoutes);

// player routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);


// start server directly
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
