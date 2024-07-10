//#  TODO
//#  Double check stickyness of update item form (specifically the select menu)
//#  Add css to constrain the width of the item images
//#  Make sure that the disabled button works after an item in the form is updated
//#  /|\
//#   | For the above one, check every field in the form
//#  Before submitting, use the HTML and CSS validators along with the WAVE tool


/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const session = require("express-session");
const pool = require("./database");

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");

/* ***********************
 * Live Reload
 *************************/
if (process.env.NODE_ENV !== "production") {
  var livereload = require("livereload");
  var connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 50);
  });
  app.use(connectLiveReload());
}

/* ***********************
 * Middleware
 * ************************/

// Middleware to set up express-session with a PostgreSQL store
// This is used to store session data on the server

// The session middleware is used to store session data on the server.
// It uses the connect-pg-simple library to store session data in a PostgreSQL database.
// The store option is set to a new instance of the connect-pg-simple library with the pool option set to the PostgreSQL pool.
// The pool option is set to the PostgreSQL pool.
// The createTableIfMissing option is set to true to create the session table if it does not exist.
// The secret option is set to the value of the SESSION_SECRET environment variable to ensure session data is encrypted.
// The resave option is set to true to save session data to the store every time the session is touched.
// The saveUninitialized option is set to true to save uninitialized session data to the store.
// The name option is set to 'sessionId' to name the cookie used to store the session ID.
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true, // Create the session table if it does not exist
      pool, // The PostgreSQL pool to use for storing session data
    }),
    secret: process.env.SESSION_SECRET, // The secret used to encrypt session data
    resave: true, // Save session data to the store every time the session is touched
    saveUninitialized: true, // Save uninitialized session data to the store
    name: "sessionId", // Name of the cookie used to store the session ID
  })
);

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(utilities.checkJWTToken)
/* ***********************
 * View Engines
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
//* Home Route
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use(static);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`);
});
