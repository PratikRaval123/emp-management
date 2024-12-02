const mogoose = require("mongoose");

const empSchema = new mogoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    // required: true,
  },
});

const user = mogoose.model("Employee", empSchema);

module.exports = user;
