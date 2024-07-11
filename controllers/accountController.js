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
      utilities.registerCookie(accountData, res)
      req.flash("notice", "Login successful.");
      return res.redirect("/account/");
    } else {
      req.flash("error", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function accountView(req, res, next) {
  const nav = await utilities.getNav()
  let managementLink = null
  if (utilities.canManage(req, res, next)) {
    managementLink = utilities.buildManagementLink()
  }
  console.log(res.locals.accountData)
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    managementLink: managementLink
  });
}

async function updateAccountView(req, res, next) { 
  const nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null
  });
}

async function updateAccount(req, res, next) {
  const {account_firstname, account_lastname, account_email} = req.body
  const modelResponse = await accountModel.updateAccount(account_firstname, account_lastname, account_email)
  if (modelResponse) {
    req.flash("notice", "Update successful.")
    delete modelResponse.account_password
    utilities.registerCookie(modelResponse, res)
    res.redirect("/account/")
  } else {
    const nav = await utilities.getNav()
    req.flash("error", "Update failed. Please try again.")
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null
    });
  }
}
async function updatePassword(req, res, next) {
  const { account_password, account_id } = req.body
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "There was an error updating your password. Please try again.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
    });
  }
  const modelResponse = await accountModel.changePassword(hashedPassword, account_id )
  if (modelResponse) {
    req.flash("notice", "Update successful.")
    res.redirect("/account/")
  } else {
    const nav = await utilities.getNav()
    req.flash("notice", "There was an error updating your password. Please try again.")
    res.render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null
    }); 
  }
}

async function logout(req, res, next) {
  utilities.clearCookie(res)
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  Login,
  accountView,
  updateAccountView,
  updateAccount,
  updatePassword,
  logout
}; // Export the login and register functions
