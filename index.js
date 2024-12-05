const http = require("http");
const express = require("express");
const app = express();
const port = process.env.PORT || 4500;
const path = require("path");
const adminRoutes = require("./routes/admin");
const empRoutes = require("./routes/empoyees");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoUri = "mongodb://localhost:27017/testing";

const logerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logerMiddleware);

//mongodb+srv://pratik:Pratik%40123@test.0akrz.mongodb.net/
mongoose
  .connect("mongodb+srv://pratikcraval:Pratik%40123@emp-manage.jp54w.mongodb.net/", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());

app.use(express.json());

app.use(adminRoutes);
app.use("/api/auth/", authRoutes);
app.use("/employee", empRoutes);

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
