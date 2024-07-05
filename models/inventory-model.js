const pool = require("../database");

/* ***************
 Get all classification data
 *************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/**
 * This function returns an array of inventory data
 * filtered by a specific classification_id.
 *
 * @param {number} classification_id - The id of the classification
 * @return {Promise<InventoryRow[]>} An array of inventory data
 */
async function getInventoryByClassificationId(
  classification_id
) {
  try {
    // Use a parameterized query to prevent SQL injection
    let data = await pool.query(
      `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id=$1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    // Log any errors that occur
    console.log("getInventoryByClassificationId error", error);
  }
}

/**
 * This function returns an array of inventory data
 * filtered by a specific inventoryId.
 *
 * @param {number} inventoryId - The id of the inventory
 * @return {Promise<InventoryRow[]>} An array of inventory data
 */
async function getInventoryByInventoryId(inventoryId) {
  try {
    // Use a parameterized query to prevent SQL injection
    // Query the inventory table for the specific inventoryId
    let data = await pool.query(
      `SELECT * FROM public.inventory
        WHERE inv_id = $1
      `,
      [inventoryId]
    );
    // Return the rows of the query result
    return data.rows;
  } catch (error) {
    // Log any errors that occur
    console.log("getInventoryByInventoryId error", error);
  }
}

/**
 * This function adds a new classification to the database.
 *
 * @param {string} classification_name - The name of the classification to be added.
 * @returns {Promise} A promise that resolves to the result of the query.
 */
async function addClassification(classification_name) {
  try {
    // Use a parameterized query to prevent SQL injection
    // Insert the new classification into the classification table
    let data = await pool.query(
      `INSERT INTO public.classification 
      (classification_name) VALUES ($1)`,
      [classification_name]
    );
    return data;
  } catch (error) {
    // Log any errors that occur
    console.log("addClassification error", error);
    return;
  }
}

/**
 * This function returns an array of all classification data.
 *
 * @returns {Promise<ClassificationRow[]>} An array of classification data
 */
async function getClassificationIds() {
  try {
    // Query the classification table for all data
    let data = await pool.query(
      `SELECT * FROM public.classification`
    );
    // Return the rows of the query result
    return data.rows;
  } catch (error) {
    // Log any errors that occur
    console.log("getClassificationIds error", error);
    return;
  }
}

/**
 * This function adds a new inventory item to the database.
 *
 * @param {string} inv_make - The make of the inventory item.
 * @param {string} inv_model - The model of the inventory item.
 * @param {number} inv_year - The year of the inventory item.
 * @param {string} inv_description - The description of the inventory item.
 * @param {string} inv_image - The image of the inventory item.
 * @param {string} inv_thumbnail - The thumbnail of the inventory item.
 * @param {number} inv_price - The price of the inventory item.
 * @param {number} inv_miles - The miles of the inventory item.
 * @param {string} inv_color - The color of the inventory item.
 * @param {number} classification_id - The classification ID of the inventory item.
 * @returns {Promise} A promise that resolves to the result of the query.
 */
async function addInventory(
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
) {
  try {
    // Use a parameterized query to prevent SQL injection
    // Insert the new inventory item into the inventory table and return the inserted data
    let data = await pool.query(
      `INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
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
      ]
    );
    return data;
  } catch (error) {
    // Log any errors that occur
    console.log("addInventory error", error);
    return;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  getClassificationIds,
  addInventory,
};
