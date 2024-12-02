const mogoose = require("mongoose");

const empSchema = new mogoose.Schema({
  profilePicture: {
    type: String,
    required: false
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    require: true
  },
  department: {
    type: String,
    require: true,
  },
  nationality: {
    type: String,
    require: true,
  },
  maritalStatus: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    require: true,
  },
  ip_address: {
    type: String,
    // required: true,
  },
});

const user = mogoose.model("Employee", empSchema);

module.exports = user;
