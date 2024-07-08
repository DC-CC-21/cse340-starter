/**
 * This JavaScript file handles the inventory management functionality.
 * It fetches inventory data based on the selected classification and builds the inventory list.
 * It also contains functions to handle API requests and build the inventory list.
 */

"use strict";

// Select the classification list element
let classificationList = document.querySelector("#classificationList");

// Fetch inventory data initially and add event listener for change event
fetchInventory();
classificationList.addEventListener("change", fetchInventory);

/**
 * Fetches inventory data based on the selected classification and builds the inventory list.
 */
function fetchInventory() {
  let classification_id = classificationList.value; // Get the selected classification ID
  console.log(`classification_id id: ${classification_id}`);

  // Construct the URL for the API request
  let classIdURL = `/inv/getInventory/${classification_id}`;

  // Fetch inventory data from the API
  fetch(classIdURL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      buildInventoryList(data); // Build the inventory list
    })
    .catch((error) => {
      console.log("There was a problem: ", error.message);
    });
}

/**
 * Builds the inventory list based on the provided data.
 * @param {Array} data - The inventory data to be displayed.
 */
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay"); // Get the inventory display element
  let dataTable = "<thead>"; // Start building the table header

  // Add table header row
  dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  dataTable += "<tbody>"; // Start building the table body

  // Iterate over each element in the data array
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);

    // Add table row for each element
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });

  dataTable += "</tbody>"; // Close the table body

  // Set the innerHTML of the inventory display element to the generated table
  inventoryDisplay.innerHTML = dataTable;
}

