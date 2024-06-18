const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "your_secret_key"; // Replace with your actual secret key

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user; // Add user to request object for further use
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authenticate;
