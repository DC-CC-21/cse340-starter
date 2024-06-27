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

/**
 * Renders a page displaying the details of a specific vehicle.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.buildByInventoryId = async function (req, res, next) {
  // Get the inventory_id from the request parameters
  const inventoryId = req.params.inventoryId;

  // Get the navigation data
  const nav = await utilities.getNav();

  // Retrieve the inventory data for the specified vehicle
  const data = await invModel.getInventoryByInventoryId(inventoryId);

  // Get the vehicle object from the data
  const vehicle = data[0];

  // Build the details section containing the vehicle data
  const details = await utilities.buildDetails(vehicle);

  // Render the page with the vehicle details and navigation data
  res.render("./inventory/vehicle", {
    title: "Vehicle Details",
    nav,
    details,
  });
};

invCont.pageWithError = async function (req, res, next) {
  res.render("./pageWithError", {
    undefinedVariableHere,
  });
}

module.exports = invCont;
