const { Pool } = require('pg');
require('dotenv').config(); // Load .env variables
const db = require('../db');

dotenv.config();

// Set the DATABASE_URL for testing (You can override the env var for testing)
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables.');
}

// Optional: Log the database URL for debugging
console.log(`Connecting to database: ${process.env.DATABASE_URL}`);

// Create a new instance of Pool with the DATABASE_URL from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;