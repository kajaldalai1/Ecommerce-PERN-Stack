const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

let orders = [];

// Secret key for signing JWT tokens (should be stored securely)
const JWT_SECRET_KEY = "kajalsecret";

// Middleware to authenticate requests
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token verification failed" });
      }
      req.user = user; // Attach the decoded user object to the request
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// POST /api/orders/checkout - Place an order
router.post("/checkout", authenticate, (req, res) => {
  // Example checkout logic
  const order = { id: orders.length + 1, total: 100, status: "Pending" };
  orders.push(order);
  res.status(200).json({ message: "Order placed successfully", order });
});

// GET /api/orders - Get all orders
router.get("/", authenticate, (req, res) => {
  res.status(200).json(orders);
});

module.exports = router;
