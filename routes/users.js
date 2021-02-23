const express = require("express");
const passport = require("passport");
const router = express.Router();

const asyncError = require("../utils/async-error");

const users = require("../controllers/users");

router
  .route("/register")
  // Show form to register new user
  .get(users.registerForm)
  // Register new user
  .post(asyncError(users.register));

router
  .route("/login")
  // Show form to login
  .get(users.loginForm)
  // Login as user
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

// Logout
router.get("/logout", users.logout);

module.exports = router;
