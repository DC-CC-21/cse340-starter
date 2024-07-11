/**
 * This file defines the routes for the account pages.
 */

// Import necessary modules
const router = require("express").Router(); // Express router module
const utilities = require("../utilities"); // Utility functions module
const accountController = require("../controllers/accountController"); // Account controller module
const regValidate = require("../utilities/account-validation");
const validate = require("../utilities/account-validation");

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
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.Login)
)
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountView))

router.get("/account-info/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountView)
)
router.post("/update-account", 
  utilities.checkLogin,
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)
router.post("/update-password", 
  utilities.checkLogin,
  validate.updatePasswordRules(),
  validate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", accountController.logout)
// Export the router module
module.exports = router;
