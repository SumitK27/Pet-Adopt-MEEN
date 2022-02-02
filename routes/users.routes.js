const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/dashboard", userController.getDashboard);

router.get("/profile", userController.getMyProfile);

router.post("/profile", userController.updateProfile);

module.exports = router;
