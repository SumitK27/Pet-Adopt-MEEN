const express = require("express");
const router = express.Router();

const baseController = require("../controllers/base.controller");

// * Base Pages
router.get("/", baseController.getHome);
router.get("/about", baseController.getAbout);
router.get("/contact", baseController.getContact);
router.post("/contact", baseController.postContact);

// * Find Pages
router.get("/find", baseController.getSearch);
router.get("/find/dogs", baseController.getDogs);
router.get("/find/cats", baseController.getCats);
// router.get("/find/breed/:breed", baseController.getBreed);

// * Animal Information
router.get("/info/animals", baseController.getAnimals);
router.get("/info/animal/:id", baseController.getAnimal);
router.get("/info/breed/:breed", baseController.getBreed);
// router.get("/info/species/:species", baseController.getSpeciesInfo);

// * Pet Recommendation
// router.get("/recommend", baseController.getRecommend);

// * Animal Recognition
// router.get("/scan", baseController.getScan);
// router.post("/scan", baseController.postScan);

module.exports = router;
