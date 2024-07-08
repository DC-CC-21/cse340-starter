// Import necessary modules
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Renders the login page.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
async function buildLogin(req, res, next) {
  // Get the navigation data
  const nav = await utilities.getNav();
  // Render the login page with the navigation data
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/**
 * Renders the registration page.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
async function buildRegister(req, res, next) {
  // Get the navigation data
  const nav = await utilities.getNav();
  // Render the registration page with the navigation data
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

async function registerAccount(req, res) {
  const nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

async function Login(req, res) {
  // const nav = await utilities.getNav();
  // const { account_email, account_password } = req.body;
  // const loginResult = await accountModel.loginAccount(
  //   account_email,
  //   account_password
  // );

  // if (loginResult) {
  //   req.flash("notice", "Login successful.");
  //   res.redirect("/");
  //   // res
  //   //   .status(201)
  //   //   .render("/", { title: "Login", nav });
  // } else {
  //   req.flash("notice", "Login failed. Please try again.");
  //   res.status(501).render("account/login", {
  //     title: "Login",
  //     nav,
  //     errors: null,
  //     account_email: account_email,
  //   });
  // }
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(
    account_email
  );
  if (!accountData) {
    req.flash(
      "notice",
      "Please check your credentials and try again."
    );
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (
      await bcrypt.compare(
        account_password,
        accountData.account_password
      )
    ) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function accountView(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  Login,
  accountView
}; // Export the login and register functions
