const express = require("express");
const path = require("path");
const router = express.Router();
const usersData = require("../MOCK_DATA.json");
const { RandomIP } = require("../util/generateIP");
const fs = require("fs");
const authentication = require("../middleware/authentication");
const User = require("../model/Employees");
const authenticatedToken = require("../index");
// Path to JSON file for persistence
const usersFilePath = path.join(__dirname, "../MOCK_DATA.json");

router.get("/", authentication, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/getEmployee/:id", authentication, (req, res) => {
  const id = req.params.id;
  console.log(id, 'id')
  const user = User.findById(id);
  console.log(user, 'user')
  console.log("RandomIP", RandomIP());
  if (user) {
    const data = User();
    res.json(data);
  } else {
    res.status(404).json({ message: "User Not found" });
  }
});

router.post("/create", authentication, async (req, res) => {
  const { id, first_name, last_name, email, gender, dateOfBirth, jobTitle, department, nationality, maritalStatus, address, salary, mobileNumber, profilePicture } = req.body;
  if (!first_name ||
    !last_name ||
    !email ||
    !gender ||
    !dateOfBirth ||
    !jobTitle ||
    !department ||
    !nationality ||
    !maritalStatus ||
    !address ||
    !salary ||
    !profilePicture ||
    !mobileNumber) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (usersData?.find((i) => i?.email === email && i?.first_name === first_name)) {
    return res.status(400).json({ error: "User already exists." });
  }

  try {
    const newUser = {
      id: usersData?.length + 1,
      profilePicture, // No type or requirements
      first_name,
      last_name,
      dateOfBirth,
      jobTitle,
      department,
      nationality,
      maritalStatus,
      address,
      email,
      gender,
      salary,
      mobileNumber,
      ip_address: RandomIP("192.168.1.0", 24),
    };
    const user = new User(newUser);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/update/:id", authentication, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user) {
      const updatedData = req.body;
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
      res.status(200).json({ user: updatedUser, message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User Not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete/:id", authentication, (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: "User deleted succes  sfully" });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
});

module.exports = router;
