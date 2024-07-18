const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const managementValidation = require("../utilities/management-validation");
const utilities = require("../utilities");

// Public Routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);
router.get(
  "/newRoute/",
  utilities.handleErrors(invController.pageWithError)
);

/* ***********************
 * Management Routes
 *************************/
// Home
router.get(
  "/",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.manageInventory)
);

// Add classification
router.get(
  "/add-classification",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.addClassificationView)
);
router.post(
  "/add-classification",
  managementValidation.addClassificationRules(),
  managementValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory
router.get(
  "/add-inventory",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.addInventoryView)
);
router.post(
  "/add-inventory",
  managementValidation.addInventoryRules(),
  managementValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Edit
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inventory_id",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.buildInventoryEditView)
);

// Update
router.post(
  "/update",
  managementValidation.newInventoryRules(),
  managementValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete
router.get(
  "/delete/:inventory_id",
  utilities.checkAccountRole,
  utilities.handleErrors(invController.deleteCionfirmationView)
);
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteFromInventory)
);

// Search 
router.get(
  "/search/",
  utilities.handleErrors(invController.BuildSearchView)
)

router.get(
  "/search/results",
  utilities.handleErrors(invController.getSearchResults)
)

// Export the router
module.exports = router;
