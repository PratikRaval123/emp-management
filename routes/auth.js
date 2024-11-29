const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const authentication = require("../middleware/authentication");
const authCtrl = require("../controllers/aurh.controllers");
router.get("/", (req, res) => {
  res.send("Wellcome to User Page");
});

router.post("/login", authCtrl.login);
router.post("/register", authCtrl.register);
router.post("/me", authentication, authCtrl.me);
router.get("/logout", authCtrl.logout);

module.exports = router;
