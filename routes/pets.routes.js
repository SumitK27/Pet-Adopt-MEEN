const express = require("express");
const router = express.Router();
const Pet = require("../controllers/pet.controller");

// * Find Pages
router.get("/find", Pet.getSearch);

// ! Pagination Error
// router.get("/find/dogs", Pet.getDogs);
// router.get("/find/cats", Pet.getCats);
// router.get("/find/breed/:breed", Pet.getBreed);

// * Pet Recommendation
// router.get("/recommend", baseController.getRecommend);

router.get("/pet-details/:id", Pet.getPetDetails);
router.get("/pet-details/:id/adopt", Pet.getAdopt);
router.post("/pet-details/:id/adopt", Pet.adoptPet);

router.get("/pet/:id/meet", Pet.getScheduleMeet);
router.post("/pet/:id/meet", Pet.scheduleMeet);

module.exports = router;
