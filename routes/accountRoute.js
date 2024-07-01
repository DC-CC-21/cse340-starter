/**
 * This file defines the routes for the account pages.
 */

// Import necessary modules
const router = require("express").Router(); // Express router module
const utilities = require("../utilities"); // Utility functions module
const accountController = require("../controllers/accountController"); // Account controller module
const regValidate = require("../utilities/account-validation");

// Define routes for account pages
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Export the router module
module.exports = router;
