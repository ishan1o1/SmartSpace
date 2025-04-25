const jwt = require("jsonwebtoken");
const userModel = require('../models/user');
const jwtSecret = "myverysec";
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }
    req.user = { userId: decoded.userid };
    const user = await userModel.findById(decoded.userid);
    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email verification required" });
    }
    next();
  });
} 

module.exports = { isLoggedIn };
