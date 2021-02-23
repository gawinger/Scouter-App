if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");

// npm modules
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoDBStore = require("connect-mongo")(session);

// utilities
const ExpressError = require("./utils/express-error");

// models
const User = require("./models/user");

// routes
const spotRoutes = require("./routes/spots");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const homeRoute = require("./routes/home");

// database connection
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/scouter";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

// ejs setup and views folder
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

// scripts allowed by helmet
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://use.fontawesome.com/",
];

// style files allowed by helmet
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com/",
];

// cdn allowed by helmet
const connectSrcUrls = ["https://api.mapbox.com/", "https://a.tiles.mapbox.com/", "https://b.tiles.mapbox.com/", "https://events.mapbox.com/", "https://fonts.googleapis.com/"];
const fontSrcUrls = ["https://use.fontawesome.com/", "https://fonts.googleapis.com/", "https://fonts.gstatic.com"];

// helmet middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dczdofrg8/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// mongoDB store setup
const store = new MongoDBStore({
  url: dbUrl,
  secret: `${process.env.SESSION_SECRET}`,
  touchAfter: 24 * 60 * 60,
});

store.on("error", (e) => {
  console.log("Session store error", e);
});

// session configuration and cookie options
const sessionConfig = {
  store,
  name: "session",
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
    HttpOnly: true,
  },
};

// session and flash middleware
app.use(session(sessionConfig));
app.use(flash());

// passport setup and middleware to manage user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// assiging flash messages and user data to local data
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// using routes from other files
app.use("/spots", spotRoutes);
app.use("/spots/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use("/", homeRoute);

// on every other route show error that page is not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// on errors render error page with message that something went wrong
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something Went Wrong";
  }
  res.status(statusCode);
  res.render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
