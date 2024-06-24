const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

/**
 * This object contains controller functions for the inventory pages.
 */
const invCont = {};

/**
 * Renders a page displaying all the vehicles of a specific classification.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.buildByClassificationId = async function (req, res, next) {
  // Get the classification_id from the request parameters
  const classification_id = req.params.classificationId;

  // Retrieve the inventory data for the specified classification
  const data = await invModel.getInventoryByClassificationId(classification_id);

  // Build the grid containing the vehicle data
  const grid = await utilities.buildClassificationGrid(data);

  // Get the navigation data
  let nav = await utilities.getNav();

  // Get the name of the classification
  const className = data[0].classification_name;

  // Render the page with the classification name and navigation data
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont;
