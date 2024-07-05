const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const managementValidation = require("../utilities/management-validation");
const utilities = require("../utilities");

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
router.get(
  "/",
  utilities.handleErrors(invController.manageInventory)
);
router.get(
  "/add-classification",
  utilities.handleErrors(invController.addClassificationView)
);
router.post(
  "/add-classification",
  managementValidation.addClassificationRules(),
  managementValidation.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.addInventoryView)
);
router.post(
  "/add-inventory",
  managementValidation.addInventoryRules(),
  managementValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
