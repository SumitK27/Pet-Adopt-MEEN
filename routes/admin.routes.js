const express = require("express");
const router = express.Router();
const multer = require("multer");

const AdminController = require("../controllers/admin.controller");
const PetController = require("../controllers/pet.controller");

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

router.get("/messages", AdminController.getAllMessages);
router.get("/message/:id", AdminController.getMessage);
router.get("/message/delete/:id", AdminController.deleteMessage);

router.get("/users", AdminController.getAllUsers);
router.get("/user/:id/edit", AdminController.getUserDetails);
router.post(
    "/user/:id/edit",
    upload.single("images"),
    AdminController.updateUserDetails
);
router.get("/user/delete/:id", AdminController.deleteUser);

router.get("/pets", PetController.getPetProfiles);

router.get("/animals", AdminController.getAllAnimals);
router.get("/animal/:id", AdminController.getAnimal);
router.get("/animal/add", AdminController.addAnimal);
router.post("/animal/add", upload.array("images"), AdminController.addAnimal);
router.get("/animal/:id/edit", AdminController.getUpdateAnimal);
router.post(
    "/animal/:id/edit",
    upload.array("images"),
    AdminController.updateAnimal
);
router.get("/animal/:id/delete", AdminController.deleteAnimal);

module.exports = router;
