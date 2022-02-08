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
router.get("/my-profile", userController.getMyProfile);
router.get("/edit-profile", userController.getEditProfile);
router.post(
    "/edit-profile",
    upload.single("images"),
    userController.updateProfile
);
router.get("/profile/delete", userController.deleteProfile);

router.get("/pet-profile", petController.getPetProfiles);

router.get("/pet-profile/add", petController.getPetAdd);
router.post("/pet-profile/add", upload.array("images"), petController.addPet);

router.get("/pet-profile/edit/:id", petController.getPetEdit);
router.post("/pet-profile/edit/:id", upload.array("images"), petController.updatePet);

router.get("/pet-profile/delete/:id", petController.deletePet);

module.exports = router;
