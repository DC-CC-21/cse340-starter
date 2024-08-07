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
invCont.buildByClassificationId = async function (
  req,
  res,
  next
) {
  // Get the classification_id from the request parameters
  const classification_id = req.params.classificationId;

  // Retrieve the inventory data for the specified classification
  const data = await invModel.getInventoryByClassificationId(
    classification_id
  );

  // Build the grid containing the vehicle data
  const grid = await utilities.buildClassificationGrid(data);

  // Get the navigation data
  let nav = await utilities.getNav();

  // Get the name of the classification
  let className = data[0]?.classification_name;
  if (!className) {
    className = "No";
  }

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
  const data = await invModel.getInventoryByInventoryId(
    inventoryId
  );

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
};

/**
 * Renders a page to manage the inventory.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.manageInventory = async function (req, res, next) {
  // Retrieve the navigation data
  const nav = await utilities.getNav();

  // Retrieve the management links
  const links = await utilities.getManagementLinks();

  const classificationSelect =
    await utilities.getClassificationIdOptions();

  // Render the page to manage the inventory with the navigation data and links
  res.render("./inventory/management", {
    title: "Manage Inventory", // Page title
    nav, // Navigation data
    links, // Management links
    classificationSelect,
  });
};

/**
 * Renders a view for adding a classification.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.addClassificationView = async function (req, res, next) {
  // Retrieve the navigation data
  const nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();

  // Render the page to add a classification with the navigation data and links
  res.render("./inventory/add-classification", {
    title: "Add Classification", // Page title
    nav, // Navigation data
    links, // Management links
    errors: null,
  });
};

/**
 * Adds a classification to the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.addClassification = async function (req, res, next) {
  // Extract the classification name from the request body
  const { classification_name } = req.body;

  try {
    // Add the classification to the database
    let data = await invModel.addClassification(
      classification_name
    );
    req.flash("Success", "Classification added successfully");
  } catch (error) {
    // Display an error message if the classification could not be added
    req.flash("Error inserting data", error);
  }

  // Retrieve the navigation data
  const nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();

  // Render the page to add a classification with the navigation data and links
  res.render("./inventory/add-classification", {
    title: "Add Classification", // Page title
    nav, // Navigation data
    links, // Management links
    errors: null,
  });
};

/**
 * Renders a view for adding an inventory.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.addInventoryView = async function (req, res, next) {
  // Retrieve the navigation data
  const nav = await utilities.getNav();
  // Retrieve the management links
  const links = await utilities.getManagementLinks();
  // Retrieve the classification id options for the dropdown
  const classIdOptions =
    await utilities.getClassificationIdOptions();
  // Render the page to add an inventory with the navigation data, links, and classification id options
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    links,
    options: classIdOptions,
    errors: null,
  });
};

/**
 * Adds an inventory to the database.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
invCont.addInventory = async function (req, res, next) {
  // Retrieve the navigation data
  const nav = await utilities.getNav();
  // Retrieve the management links
  const links = await utilities.getManagementLinks();
  // Extract the inventory data from the request body
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  // Retrieve the classification id options for the dropdown
  try {
    // Add the inventory to the database
    let data = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    // Display a success message if the inventory was added successfully
    req.flash("Success", "Inventory added successfully");
  } catch (error) {
    // Display an error message if the inventory could not be added
    req.flash("Error inserting data", error);
  }
  // Render the page to add an inventory with the navigation data, links, and classification id options
  const classIdOptions =
    await utilities.getClassificationIdOptions();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    links,
    options: classIdOptions,
    errors: null,
  });
};

/**
 * Retrieves inventory data by classification ID and returns it as JSON
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 */
invCont.getInventoryJSON = async (req, res, next) => {
  // Parse the classification ID from the request parameters
  const classification_id = parseInt(
    req.params.classification_id
  );

  // Retrieve inventory data by classification ID
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );

  // If data is returned, return it as JSON
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    // If no data is returned, pass an error to the next middleware function
    next(new Error("No data returned"));
  }
};

invCont.buildInventoryEditView = async (req, res, next) => {
  const inventory_id = parseInt(req.params.inventory_id);

  const nav = await utilities.getNav();
  const itemData = (
    await invModel.getInventoryByInventoryId(inventory_id)
  )[0];
  const options = await utilities.getClassificationIdOptions();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  const links = await utilities.getManagementLinks();
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options,
    links,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName =
      updateResult.inv_make + " " + updateResult.inv_model;
    req.flash(
      "notice",
      `The ${itemName} was successfully updated.`
    );
    res.redirect("/inv/");
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.deleteCionfirmationView = async (req, res, next) => {
  const inventory_id = parseInt(req.params.inventory_id);
  const nav = await utilities.getNav();
  const itemData = (
    await invModel.getInventoryByInventoryId(inventory_id)
  )[0];
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  const links = await utilities.getManagementLinks();
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    links,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

invCont.deleteFromInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const links = await utilities.getManagementLinks();
  const { inv_id, inv_make, inv_model, inv_price, inv_year } =
    req.body;
  const deleteResult = await invModel.deleteFromInventory(
    inv_id
  );
  console.log(deleteResult);

  if (deleteResult) {
    const itemName =
      deleteResult.inv_make + " " + deleteResult.inv_model;
    req.flash(
      "notice",
      `The ${itemName} was successfully deleted.`
    );
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Edit " + itemName,
      nav,
      links,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

invCont.BuildSearchView = async (req, res, next) => {
  const nav = await utilities.getNav();
  const data = await invModel.getAllInventory();
  let filters = utilities.buildSearchFilters(data);
  console.log(filters);
  res.render("./inventory/search", {
    title: "Search",
    nav,
    errors: null,
    grid: await utilities.buildClassificationGrid(data),
    filters: filters,
  });
};

/**
 * Handles the search form submission by filtering the inventory data based on
 * the search criteria and sending the filtered grid data back to the client.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
invCont.getSearchResults = async (req, res, next) => {
  const searchParams = req.query;
  let filteredData = await invModel.getAllInventory();
  console.log(searchParams);
  let searchValue = searchParams.search;
  delete searchParams.search;

  /**
   * If there are search parameters, filter the data based on the criteria.
   * If there is a search value, filter based on the make name. Otherwise, filter
   * based on the other search parameters.
   */
  if (Object.keys(searchParams).length || searchValue) {
    filteredData = filteredData.filter((item) => {
      let isMatch = false;
      if (searchValue) {
        let vehicle_name = `${item.inv_make} ${item.inv_model}`;
        if (
          vehicle_name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          isMatch = true;
        }
      } else {
        isMatch = true;
      }
      /**
       * Iterate over the search parameters and check if the current item
       * matches any of the criteria. If there is a search value, check if
       * the make name includes the search value. If there are other search
       * parameters, check if the item matches any of them.
       */
      if (isMatch) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (!isMatch) return;
          if (Array.isArray(value)) {
            isMatch = value.some((criteria) => {
              switch (key) {
                case "year":
                  return utilities.matchYear(
                    item.inv_year,
                    criteria
                  );
                case "prices":
                  return utilities.matchPrice(
                    item.inv_price,
                    criteria
                  );
                default:
                  return false;
              }
            });
          } else {
            switch (key) {
              case "year":
                isMatch = utilities.matchYear(
                  item.inv_year,
                  value
                );
                break;
              case "prices":
                isMatch = utilities.matchPrice(
                  item.inv_price,
                  value
                );
                break;
              default:
                isMatch = false;
            }
          }
        });
      }

      return isMatch;
    });
  }

  /**
   * If there are results, send the filtered grid data back to the client.
   * Otherwise, send a message indicating that no results were found.
   */
  if (filteredData.length) {
    res.send({
      grid: await utilities.buildClassificationGrid(
        filteredData
      ),
    });
  } else {
    res.send({
      msg: "No results found.",
    });
  }
};

module.exports = invCont;
