const jwt = require("jsonwebtoken");
require("dotenv").config();
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
                        <img src="${
                          vehicle.inv_thumbnail
                        }" alt="Image of ${vehicle.make} ${
        vehicle.inv_make
      } ${vehicle.inv_model} on CSE Motors">
                    </a>
                    <div class="namePrice"> <!-- Start a div to contain the vehicle's name and price -->
                        <hr/>
                        <h2>
                            <a
                                href="../../inv/detail/${
                                  vehicle.inv_id
                                }"
                                title="View ${
                                  vehicle.inv_make
                                } ${vehicle.inv_model} details"
                                >
                                ${vehicle.inv_make} ${
        vehicle.inv_model
      }
                            </a>
                        </h2>
                        <span> <!-- Start a span to contain the vehicle's price -->
                            $${new Intl.NumberFormat(
                              "en-US"
                            ).format(vehicle.inv_price)}
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
        alt="Main image of ${data.inv_make} ${
    data.inv_model
  } on CSE Motors"
        class="main"
        >
      <div class="thumbnail-container">
        <img
          src="${data.inv_thumbnail}" 
          alt="Thumbnail of ${data.inv_make} ${
    data.inv_model
  } on CSE Motors"
          class="thumbnail"
          >
      </div>
    </div>
    <div class="info">
      <h1>${data.inv_year} ${data.inv_make} ${
    data.inv_model
  }</h1>
      <div>
        ${detailTemplate(
          "Price",
          `$${new Intl.NumberFormat("en-US").format(
            data.inv_price
          )}`
        )}
        ${detailTemplate(
          "Miles",
          `${Number(data.inv_miles).toLocaleString()} miles`
        )}
        ${detailTemplate("Color", `${data.inv_color}`)}
        ${detailTemplate(
          "Description",
          `${data.inv_description}`
        )}
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

Util.getManagementLinks = async function () {
  return `
    <ul id="management-links">
      <li><a href="/inv/add-classification">Add Classification</a></li>
      <li><a href="/inv/add-inventory">Add Vehicle</a></li>
    </ul>
  `;
};

Util.getClassificationIdOptions = async function (value = "") {
  const options = await invModel.getClassificationIds();
  return options
    .map((option) => {
      console.log(
        option.classification_name,
        option.classification_id,
        value,
        option.classification_id == value
          ? 'selected="selected"'
          : ""
      );
      return `<option 
              value="${option.classification_id}"
              ${
                option.classification_id == value
                  ? 'selected="selected"'
                  : ""
              }
              >
                ${option.classification_name}
            </option>`;
    })
    .join("");
};

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login");
  }
};

Util.canManage = (req, res, next) => {
  const role = res.locals?.accountData?.account_type;
  if (role === "Admin" || role === "Employee") {
    return true;
  } else {
    return false;
  }
};

Util.checkAccountRole = (req, res, next) => {
  if (Util.canManage(req, res, next)) {
    next();
  } else {
    req.flash(
      "error",
      "You do not have permission to view that page"
    );
    return res.redirect("/account/login");
  }
};

Util.buildManagementLink = () => {
  return `
    <h3>Inventory Management</h3>
    <p>
      <a href="/inv/">View Inventory</a>
    </p>
  `;
};

Util.registerCookie = (accountData, res) => {
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
};

Util.clearCookie = (res) => {
  res.clearCookie("jwt");
};

Util.buildSearchFilters = (data) => {
  const filters = {
    // make: new Set(data.map((item) => item.inv_make)),
    // model: new Set(data.map((item) => item.inv_model)),
    prices: [
      "< 25,000",
      "25,000-50,000",
      "50,000-100,000",
      "> 100,000",
    ],
    year: new Set(data.map((item) => item.inv_year)),
  };

  return `<div class="filters">${Object.entries(filters)
    .map(([key, value]) => {
      return `
      <h4 class="filter-title">${Util.toTitleCase(key)}</h4>
      <ul>
        ${Array.from(value)
          .sort((a, b) => a - b)
          .map((item) => {
            return `<li>
            <label for="${key}-${item}">
              <input type="checkbox" id="${key}-${item}" name="${key}" value="${item}"/>
              ${item}
            </label>
          </li>`;
          })
          .join("")}
      </ul>
      `;
    })
    .join("")}
    </div>
  `;
};

/**
 * Checks if two year values match.
 * @param {number | string} value1 - The first year value.
 * @param {number | string} value2 - The second year value.
 * @returns {boolean} - Whether the two year values match.
 */
Util.matchYear = (value1, value2) => {
  // If the values are equal, return true.
  if (value1 == value2) {
    return true;
  }
  // Otherwise, return false.
  return false;
};

/**
 * Checks if a price value matches a given price range.
 * @param {number | string} value1 - The price value to check.
 * @param {string} value2 - The price range to compare against.
 * @returns {boolean} - Whether the price value matches the price range.
 */
Util.matchPrice = (value1, value2) => {
  // Remove any non-numeric characters from the price range.
  let v = value2.replace(/[<>, ]/g, "");

  // Check if the price range is less than a certain value.
  if (value2.includes("<") && +value1 < +v) {
    return true;
  }
  // Check if the price range is greater than a certain value.
  else if (value2.includes(">") && +value1 > +v) {
    return true;
  }
  // Check if the price range is within a certain range.
  else if (value2.includes("-")) {
    let values = v.split("-");
    if (+value1 >= +values[0] && +value1 <= +values[1]) {
      return true;
    }
  }
  // If none of the above conditions are met, return false.
  return false;
};

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} - The converted string in title case.
 */
Util.toTitleCase = (str) => {
  // Replace every word in the string with its title case version.
  return str.replace(/\w\S*/g, function (txt) {
    return (
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  });
};

module.exports = Util;
