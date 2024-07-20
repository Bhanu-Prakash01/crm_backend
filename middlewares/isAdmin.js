const jwt = require('jsonwebtoken');
const User = require('../models/user');
const verifyAdminToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log(user);
    // if (user.isAdmin) {
    //   return res.status(403).json({ message: "Unauthorized access" });
    // }
    // if (!decoded.isadmin) {
    //   return res.status(403).json({ message: "Unauthorized access" });
    // }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports.verifyAdminToken = verifyAdminToken;