const User = require("../models/user");

// Show form to register new user
module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

// Register new user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // login registered user 
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Scouter");
      res.redirect("/spots");
    });
  } catch (err) {
    // if user already exist set error message
    err.message.includes("E11000 duplicate key error collection") ? (err.message = "This email address is already taken") : null;
    req.flash("error", err.message);
    res.redirect("register");
  }
};

// Show form to login
module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

// Login as user
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back");
  // set redirect url to url that user attempted to go to or to /spots
  const redirectUrl = req.session.returnTo || "/spots";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye");
  delete req.session.returnTo;
  res.redirect("/spots");
};
