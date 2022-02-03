const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");

router.get("/messages", AdminController.getAllMessages);
router.get("/message/:id", AdminController.getMessage);
router.get("/message/delete/:id", AdminController.deleteMessage);

router.get("/users", AdminController.getAllUsers);
router.get("/user/:id", AdminController.getUserDetails);
router.post("/user/:id", AdminController.updateUserDetails);

module.exports = router;
