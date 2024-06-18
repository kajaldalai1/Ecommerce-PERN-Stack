const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecommerce",
  password: "superinnings",
  port: 5432,
});

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_default_secret"; // Secret key

// POST /api/users/signup - User signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Insert new user into database
    const hashedPassword = password; // Implement password hashing here if needed
    const newUserQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
    const newUser = await pool.query(newUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    // Generate JWT token after signup
    const token = generateToken(newUser.rows[0].id);

    res.status(201).json({ token }); // Respond with token or success message
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed. Please try again later." });
  }
});

// POST /api/users/login - User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in database
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to get user by email from database
async function getUserByEmail(email) {
  const getUserQuery = `
    SELECT id, username, email, password
    FROM users
    WHERE email = $1
  `;
  const result = await pool.query(getUserQuery, [email]);
  return result.rows[0];
}

// Function to generate JWT token
function generateToken(userId) {
  const token = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
}

module.exports = router;
