const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to the PostgreSQL database");
  }
});

module.exports = pool;
