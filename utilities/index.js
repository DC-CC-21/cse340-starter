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
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

Util.canManage = (req, res, next) => {
  const role = res.locals?.accountData?.account_type
  if (role === "Admin" || role === "Employee") { 
    return true
  } else {
    return false
  }

}

Util.checkAccountRole = (req, res, next) => {
  if (Util.canManage(req, res, next)) {
    next()
  } else {
    req.flash("error", "You do not have permission to view that page")
    return res.redirect("/account/login")
  }
}

Util.buildManagementLink = () => {
  return `
    <h3>Inventory Management</h3>
    <p>
      <a href="/inv/">View Inventory</a>
    </p>
  `
}

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
}

Util.clearCookie = (res) => {
  res.clearCookie("jwt")
}

module.exports = Util;
