const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");

router.get("/messages", AdminController.getAllMessages);
router.get("/message/:id", AdminController.getMessage);
router.get("/message/delete/:id", AdminController.deleteMessage);

module.exports = router;
