const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");

router.get("/messages", AdminController.getMessages);

module.exports = router;
