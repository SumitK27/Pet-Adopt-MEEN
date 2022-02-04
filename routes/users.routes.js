const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const petController = require("../controllers/pet.controller");

router.get("/dashboard", userController.getDashboard);
router.get("/profile", userController.getMyProfile);
router.post("/profile", userController.updateProfile);

router.get("/pet-profile", petController.getPetProfiles);
router.get("/pet-profile/add", petController.getPetAdd);
router.post("/pet-profile/add", petController.addPet);
router.get("/pet-profile/delete/:id", petController.deletePet);

module.exports = router;
