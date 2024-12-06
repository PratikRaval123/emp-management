const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  console.log(req.headers.authorization, "ele");
  try {
    const authHeader = req.headers.authorization || "";
    const token = (authHeader && authHeader.split(" ")[1]) || "";
    console.log(token, "token");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token or expired" });
        }
        req.user = user;
        next();
      });
    }
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
module.exports = authentication;
