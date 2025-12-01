const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

// REGISTER USER 
router.post(
// (1) path
  "/register",

// (2) validation middlewares
  [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("Firstname must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],

// (3) controller function
  userController.registerUser
);

// LOGIN USER
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

module.exports = router;
