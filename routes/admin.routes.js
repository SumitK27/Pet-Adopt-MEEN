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
router.get("/user/:id", AdminController.getUserDetails);
router.post(
    "/user/:id",
    upload.single("images"),
    AdminController.updateUserDetails
);

router.get("/pets", PetController.getPetProfiles);

module.exports = router;
