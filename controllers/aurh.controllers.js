const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", { domain: "localhost", path: "/" });
  res.status(200).json({ message: "Logout successful" });
};

exports.me = async (req, res, next) => {
  try {
    // console.log(req.user, "req.user");

    if (req.user.id) {
      const user = await User.findById(req.user.id);
      res.status(200).json({
        user: user,
        Success: true,
        message: "Success",
      });
    } else {
      const error = new Error("User not authorized!");
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
