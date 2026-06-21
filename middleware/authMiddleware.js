// middleware/authMiddleware.js
// This middleware function runs BEFORE protected route handlers.
// Its job: check if a valid JWT token was sent, and if so, attach the
// logged-in user's id to req.user so later code knows who is making the request.

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // The frontend sends the token like this: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  // Split "Bearer xxxxx" and take just the token part
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify checks the token is valid AND not expired.
    // It throws an error automatically if the token is bad or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We attach the user id from inside the token onto the request object.
    // Now every controller after this middleware can use req.userId
    req.userId = decoded.userId;

    next(); // move on to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
