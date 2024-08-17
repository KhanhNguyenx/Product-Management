const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controllers/admin/restored.controller");
router.get("/", controller.index);
router.patch("/restored/:id", controller.restored);
module.exports = router;
