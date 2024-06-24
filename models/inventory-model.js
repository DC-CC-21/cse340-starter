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
async function getInventoryByClassificationId(classification_id) {
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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
};
