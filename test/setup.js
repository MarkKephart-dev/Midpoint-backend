const { Pool } = require('pg');
require('dotenv').config(); // Load .env variables
const db = require('../db');

dotenv.config();

// Set the DATABASE_URL for testing (You can override the env var for testing)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://mtkephart:Aircatfloats3@localhost:5432/midpointtest';

// Optional: Log the database URL for debugging
console.log(`Connecting to database: ${process.env.DATABASE_URL}`);

// Create a new instance of Pool with the DATABASE_URL from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;