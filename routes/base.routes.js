const express = require("express");
const router = express.Router();

const baseController = require("../controllers/base.controller");

router.get("/", baseController.getHome);
router.get("/about", baseController.getAbout);
router.get("/contact", baseController.getContact);
router.post("/contact", baseController.postContact);

module.exports = router;
