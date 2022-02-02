const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/dashboard", userController.getDashboard);

router.get("/profile", userController.getMyProfile);

module.exports = router;
