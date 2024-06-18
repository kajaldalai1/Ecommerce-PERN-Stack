const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const pool = require("../models/db");

const cartItems = [
  { id: 1, name: "Product Name", price: 10, quantity: 2 },
  { id: 2, name: "Another Product", price: 20, quantity: 1 },
];

// GET /api/cart endpoint - Get all items in the cart
router.get("/", authenticate, (req, res) => {
  res.json(cartItems);
});

// POST /api/cart/:productId - Add product to cart
router.post("/:productId", authenticate, async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingCartItem = cartItems.find((item) => item.id === productId);
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cartItems.push({ ...product[0], quantity: 1 });
    }
    res.status(200).json({ message: `Product ${productId} added to cart` });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/cart/checkout - Checkout the cart
router.post("/checkout", authenticate, async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by the authenticate middleware

  try {
    // Validate and calculate the total price
    let total = 0;
    for (const item of cartItems) {
      const [product] = await pool.query(
        "SELECT * FROM products WHERE id = ?",
        [item.id]
      );
      if (product.length === 0 || product[0].stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Product ${item.name} is out of stock` });
      }
      total += item.price * item.quantity;
    }

    // Create a new order
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)",
      [userId, total, "Pending"]
    );
    const orderId = orderResult.insertId;

    // Create order items and update product stock
    for (const item of cartItems) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
      await pool.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.id,
      ]);
    }

    // Clear the cart
    cartItems.length = 0;

    res.json({ message: "Checkout successful", orderId });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
