/**
 * This JavaScript file handles the search functionality for inventory.
 * It listens for clicks on the filters and the search button, and the
 * keyup event on the search input. When a search is triggered, it
 * builds the search URL based on the selected filters and the search
 * input value. It then fetches the search results and updates the
 * inventory display element.
 */

// Get all input elements with the class "filters"
let allInputs = document.querySelectorAll(".filters input");

// Get the search box element
let searchBox = document.querySelector("#search");

// Add an event listener to the filters element for clicks on the filters
document
  .querySelector(".filters")
  .addEventListener("click", async (e) => {
    // If the clicked element is an input, trigger a search
    if (e.target.tagName === "INPUT") search();
  });

// Add an event listener to the search button for clicks
document
  .getElementById("searchBtn")
  .addEventListener("click", search);

// Add an event listener to the search input for the keyup event
searchBox.addEventListener("keyup", (e) => {
  // If the pressed key is Enter, trigger a search
  if (e.key === "Enter") search();
});

/**
 * Performs a search based on the selected filters and the search input value.
 * Builds the search URL and fetches the search results. Updates the inventory
 * display element.
 */
async function search() {
  // Base URL for the search
  let base = "/inv/search/results?";

  // Get the search value from the search input
  let searchValue = searchBox.value;
  base += `search=${searchValue}&`;

  // Get the checked filters and add them to the search URL
  allInputs.forEach((input) => {
    if (input.checked) base += `${input.name}=${input.value}&`;
  });

  // Fetch the search results
  let response = await fetch(base);

  // If the response is not OK, return early
  if (!response.ok) {
    return;
  }

  // Parse the response body as JSON
  let data = await response.json();

  // If there is an error message, display it
  if (data.msg) {
    document.querySelector("#inv-display").innerHTML = data.msg;
    return;
  }

  // Update the inventory display element with the search results
  document.querySelector("#inv-display").outerHTML = data.grid;
}

