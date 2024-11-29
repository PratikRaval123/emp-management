const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    "<h2 style='text-align: start; font-family: Arial, Helvetica, sans-serif; font-size: 20px; color: rgb(0, 0, 0);'>Wellcome to Admin Page</h2>"
  );
});

module.exports = router;
