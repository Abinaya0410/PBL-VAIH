const jwt = require("jsonwebtoken");

// =======================
// AUTH MIDDLEWARE
// =======================
const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from headers
    const authHeader = req.headers.authorization;

    // Token format: "Bearer tokenvalue"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request
    req.user = decoded;

    // 4. Move to next middleware / controller
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
