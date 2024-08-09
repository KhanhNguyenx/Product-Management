const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/restored.controller");
router.get("/", controller.index);
router.patch(
  "/restored/product-category-restored/:id",
  controller.ProductCategoryRestored
);
router.patch("/restored/product-restored/:id", controller.productRestored);
module.exports = router;
