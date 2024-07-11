/**
 * Module that contains utility functions for validating account registration data.
 *
 * @module utilities/account-validation
 */

// Import necessary modules
const utilities = require(".");
const accountModel = require("../models/account-model");

const { body, validationResult } = require("express-validator");
const validate = {};

/**
 * Validation rules for account registration data.
 *
 * @returns {Array} - An array of validation rules.
 */
validate.registrationRules = () => {
  return [
    /**
     * Validates the account firstname field.
     *
     * @returns {Array} - An array of validation rules for the account firstname field.
     */
    body("account_firstname")
      .trim() // Remove leading/trailing whitespaces
      .escape() // Escape special characters
      .notEmpty() // Ensure field is not empty
      .isLength({ min: 1 }) // Ensure field has a minimum length of 1 character
      .withMessage("Please provide a first name."), // Custom error message for invalid input

    /**
     * Validates the account lastname field.
     *
     * @returns {Array} - An array of validation rules for the account lastname field.
     */
    body("account_lastname")
      .trim() // Remove leading/trailing whitespaces
      .escape() // Escape special characters
      .notEmpty() // Ensure field is not empty
      .isLength({ min: 2 }) // Ensure field has a minimum length of 2 characters
      .withMessage("Please provide a last name."), // Custom error message for invalid input

    /**
     * Validates the account email field.
     *
     * @returns {Array} - An array of validation rules for the account email field.
     */
    body("account_email")
      .trim() // Remove leading/trailing whitespaces
      .escape() // Escape special characters
      .notEmpty() // Ensure field is not empty
      .isEmail() // Ensure field is a valid email address
      .normalizeEmail() // Normalize the email address
      .withMessage("A valid email address is required.") // Custom error message for invalid input
      .custom(async (account_email) => {
        const email = await accountModel.checkExistingAccount(
          account_email
        );
        if (email) {
          return Promise.reject(
            `Email exists. Please log in or use a different email.`
          );
        }
      }),

    /**
     * Validates the account password field.
     *
     * @returns {Array} - An array of validation rules for the account password field.
     */
    body("account_password")
      .trim() // Remove leading/trailing whitespaces
      .notEmpty() // Ensure field is not empty
      .isStrongPassword({
        minLength: 12, // Ensure password has a minimum length of 12 characters
        minLowercase: 1, // Ensure password contains at least 1 lowercase letter
        minUppercase: 1, // Ensure password contains at least 1 uppercase letter
        minNumbers: 1, // Ensure password contains at least 1 number
        minSymbols: 1, // Ensure password contains at least 1 special character
      })
      .withMessage("Password does not meet requirements."), // Custom error message for invalid input
  ];
};

/**
 * Validation rules for account registration data.
 *
 * @returns {Array} - An array of validation rules.
 */
validate.loginRules = () => {
  return [
    /**
     * Validates the account email field.
     *
     * @returns {Array} - An array of validation rules for the account email field.
     */
    body("account_email")
      .trim() // Remove leading/trailing whitespaces
      .escape() // Escape special characters
      .notEmpty() // Ensure field is not empty
      .isEmail() // Ensure field is a valid email address
      .normalizeEmail() // Normalize the email address
      .withMessage("A valid email address is required.") // Custom error message for invalid input
      .custom(async (account_email) => {
        const email = await accountModel.checkExistingAccount(
          account_email
        );
        if (!email) {
          return Promise.reject(
            `Email does not exists. Please sign up or use a different email.`
          );
        }
      }),

    /**
     * Validates the account password field.
     *
     * @returns {Array} - An array of validation rules for the account password field.
     */
    body("account_password")
      .trim() // Remove leading/trailing whitespaces
      .notEmpty() // Ensure field is not empty
      .isStrongPassword({
        minLength: 12, // Ensure password has a minimum length of 12 characters
        minLowercase: 1, // Ensure password contains at least 1 lowercase letter
        minUppercase: 1, // Ensure password contains at least 1 uppercase letter
        minNumbers: 1, // Ensure password contains at least 1 number
        minSymbols: 1, // Ensure password contains at least 1 special character
      })
      .withMessage("Password does not meet requirements."), // Custom error message for invalid input
  ];
};

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  } else {
    next();
  }
};
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    });
    return;
  } else {
    next();
  }
};

validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required"),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required"),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .custom(async (account_email) => {
        const email = await accountModel.checkExistingAccount(
          account_email
        );
        if (email && account_email !== email.account_email) {
          return Promise.reject(
            `Email already exists. Please sign up or use a different email.`
          );
        }
      }),
  ];
};
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  const nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    res.render(`account/update`, {
      title: "Update Account Information",
      nav,
      errors,
    });
  } else {
    next();
  }
};

validate.checkUpdatePasswordData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render(`account/update`, {
      title: "Update Account Information",
      nav,
      errors,
    });
    return;
  } else {
    next();
  }
};

module.exports = validate;
