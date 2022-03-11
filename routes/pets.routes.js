const express = require("express");
const router = express.Router();
const Pet = require("../controllers/pet.controller");

router.get("/pet-details/:id", Pet.getPetDetails);

module.exports = router;
