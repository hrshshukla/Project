const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlenght: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlenght: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlenght: [5, "Email must be at least 5 characters long"],
  },
  password: { type: String, required: true, select: false },
  socketId: { type: String }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'}); // token will become useless after 24hrs 
  return token;
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;