const pool = require("../models/db");

exports.placeOrder = async (req, res) => {
  const { userId, items } = req.body;
  try {
    const client = await pool.connect();
    await client.query("BEGIN");
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [userId, 0]
    );
    const orderId = orderResult.rows[0].id;

    let total = 0;
    for (const item of items) {
      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [item.productId]
      );
      const product = productResult.rows[0];
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.productId, item.quantity, itemTotal]
      );
    }

    await client.query("UPDATE orders SET total = $1 WHERE id = $2", [
      total,
      orderId,
    ]);
    await client.query("COMMIT");
    client.release();
    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  // This function can be implemented similarly to placeOrder, but instead of creating an order, it should add items to a user's cart.
  res.status(501).json({ message: "Not implemented" });
};

exports.checkout = async (req, res) => {
  // This function can finalize the order and perform payment processing.
  res.status(501).json({ message: "Not implemented" });
};

exports.logout = async (req, res) => {
  // This function can handle logout by invalidating the user's session or JWT.
  res.status(501).json({ message: "Not implemented" });
};
