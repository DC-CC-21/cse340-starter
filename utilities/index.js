const invModel = require("../models/inventory-model");
const Util = {};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Retrieves all classifications and returns an HTML unordered list of links to view the inventory by classification.
 * @returns {Promise<string>} A string representing an HTML unordered list of classification links.
 */
Util.getNav = async function () {
  // Retrieve all classifications from the inventory model
  let data = await invModel.getClassifications();
  // Build the HTML list of classification links
  let list = "<ul>";
  list += '<li><a href="/" title="Home">Home</a></li>';
  // Iterate over each classification and add it to the list
  data.rows.forEach((row) => {
    list += `
        <li>
            <a
                href="/inv/type/${row.classification_id}"
                title="See our inventory of ${row.classification_name} vehicles"
                >
                ${row.classification_name}
            </a>
        </li>
    `;
  });
  list += "</ul>";
  return list;
};

/**
 * Builds a grid of vehicles based on the provided data.
 * If data is empty, a message is returned indicating that no matching vehicles could be found.
 * @param {Array} data - An array of vehicle objects to be used in creating the grid.
 * @returns {string} - A string representing an HTML unordered list of the vehicles.
 */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">'; // Start the grid with an unordered list element
    data.forEach((vehicle) => {
      grid += `
                <li>
                    <a
                        href="../../inv/detail/${vehicle.inv_id}"
                        title="View ${vehicle.inv_make} ${
        vehicle.inv_model
      } details"
                        >
                        <img src="${vehicle.inv_thumbnail}" alt="Image of ${
        vehicle.make
      } ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
                    </a>
                    <div class="namePrice"> <!-- Start a div to contain the vehicle's name and price -->
                        <hr/>
                        <h2>
                            <a
                                href="../../inv/detail/${vehicle.inv_id}"
                                title="View ${vehicle.inv_make} ${
        vehicle.inv_model
      } details"
                                >
                                ${vehicle.inv_make} ${vehicle.inv_model}
                            </a>
                        </h2>
                        <span> <!-- Start a span to contain the vehicle's price -->
                            $${new Intl.NumberFormat("en-US").format(
                              vehicle.inv_price
                            )}
                        </span>
                    </div>
                </li>
            `;
    });
    grid += "</ul>"; // End the grid with the closing unordered list element
  } else {
    grid = "<p>Sorry, no matching vehicles could be found.</p>"; // If there are no vehicles, return a message indicating that no matching vehicles could be found
  }
  return grid;
};

/**
 * Builds the details of a vehicle.
 * 
 * @param {Object} data - The data of the vehicle.
 * @returns {Promise<string>} - The HTML string of the details.
 */
Util.buildDetails = async function (data) {
  /**
   * Builds a detail template.
   * 
   * @param {string} name - The name of the detail.
   * @param {string} value - The value of the detail.
   * @returns {string} - The HTML string of the detail template.
   */
  function detailTemplate(name, value) {
    return `
      <div class="detail">
      <span class="label">${name}:</span>
      <span class="value">${value}</span>
      </div>
    `;
  }
  let details = `
    <div>
      <img
        src="${data.inv_image}" 
        alt="Main image of ${data.inv_make} ${data.inv_model} on CSE Motors"
        class="main"
        >
      <div class="thumbnail-container">
        <img
          src="${data.inv_thumbnail}" 
          alt="Thumbnail of ${data.inv_make} ${data.inv_model} on CSE Motors"
          class="thumbnail"
          >
      </div>
    </div>
    <div class="info">
      <h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
      <div>
        ${detailTemplate(
          "Price",
          `$${new Intl.NumberFormat("en-US").format(data.inv_price)}`
        )}
        ${detailTemplate("Miles", `${data.inv_miles} miles`)}
        ${detailTemplate("Color", `${data.inv_color}`)}
        ${detailTemplate("Description", `${data.inv_description}`)}
      </div>
      <div class="buttons">
        <a>Start My Purchase</a>
        <a>Contact Us</a>
        <a>Schedule Test Drive</a>
      </div>
    </div>
  `;
  return details;
};

module.exports = Util;
