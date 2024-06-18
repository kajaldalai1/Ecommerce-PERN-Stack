const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecommerce",
  password: "superinnings",
  port: 5432,
});

module.exports = pool;
