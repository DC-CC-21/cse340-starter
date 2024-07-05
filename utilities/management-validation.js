/**
 * Module that contains utility functions for validating account registration data.
 *
 * @module utilities/account-validation
 */

// Import necessary modules
const utilities = require(".");

const { body, validationResult } = require("express-validator");
const validate = {};

validate.addClassificationRules = () => {
  return [
    /**
     * Validates the classification name field.
     *
     * @returns {Array} - An array of validation rules for the classification name field.
     */
    body("classification_name")
      .trim() // Remove leading/trailing whitespaces
      .escape() // Escape special characters
      .notEmpty() // Ensure field is not empty
      .isLength({ min: 1 }) // Ensure field has a minimum length of 1 character
      .withMessage("Please provide a classification name."), // Custom error message for invalid input

    body("classification_name")
      .matches("[a-zA-Z0-9_]+") // Ensure field contains only letters, numbers, and underscores
      .withMessage(
        "Classification name must contain only letters, numbers, and underscores."
      ),
  ];
};
validate.addInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make name."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model name."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a year."),
    body("inv_year")
      .isNumeric()
      .withMessage("Year is not valid"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description name."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image name."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image thumbnail."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a price."),
    body("inv_price")
      .isNumeric()
      .withMessage("Price is not valid number."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide number of miles."),
    body("inv_miles")
      .isNumeric()
      .withMessage("Miles is not valid number."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid color."),

    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification id."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const links = await utilities.getManagementLinks();
    res.locals = { ...res.locals, ...req.body };

    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      links,
      errors: errors,
    });
    return;
  } else {
    next();
  }
};

validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const links = await utilities.getManagementLinks();
    const options = await utilities.getClassificationIdOptions(req.body.classification_id);
    res.locals = { ...res.locals, ...req.body };
    res.render("./inventory/add-inventory", {
      title: "Add Classification",
      nav,
      links,
      errors: errors,
      options: options,
    });
    return;
  } else {
    next();
  }
};

module.exports = validate;
