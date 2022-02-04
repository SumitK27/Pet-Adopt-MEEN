const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/user.controller");
const petController = require("../controllers/pet.controller");

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storageConfig,
});

router.get("/dashboard", userController.getDashboard);
router.get("/profile", userController.getMyProfile);
router.post("/profile", userController.updateProfile);

router.get("/pet-profile", petController.getPetProfiles);
router.get("/pet-profile/add", petController.getPetAdd);
router.post("/pet-profile/add", upload.array("images"), petController.addPet);
router.get("/pet-profile/delete/:id", petController.deletePet);

module.exports = router;
