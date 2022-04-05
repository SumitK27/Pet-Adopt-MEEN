const fs = require("fs");
const Pet = require("../models/pet.model");
const User = require("../models/user.model");
const pagination = require("../util/pagination");

async function getSearch(req, res) {
    const currentPage = req.query.page;
    const pet = new Pet();
    const count = await pet.getCount();
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPets(startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage });
}

async function getByType(req, res) {
    const type = req.params.type;
    const currentPage = req.query.page;
    const pet = new Pet();
    const count = await pet.getCountByType(type);
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPetsByType(type, startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage });
}

async function getByBreed(req, res) {
    const breed = req.params.breed;
    const currentPage = req.query.page;
    const pet = new Pet();
    const count = await pet.getCountByBreed(breed);
    const { startFrom, perPage, pages } = pagination(count, currentPage, 8);

    const petData = await pet.getAllPetsByBreed(breed, startFrom, perPage);
    res.render("users/search", { petData, pages, currentPage });
}

async function getPetProfiles(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    const currentPage = req.query.page;

    const pet = new Pet();
    const count = await pet.getCount();

    const { startFrom, perPage, pages } = pagination(count, currentPage, 4);

    if (!res.locals.isAdmin) {
        const petData = await pet.getMyPets(res.locals.uid);

        res.render("shared/pets", {
            pets: petData,
            pages: pages,
            currentPage,
            isAdmin: false,
        });
        return;
    }

    const petData = await pet.getAllPets(startFrom, perPage);
    res.render("shared/pets", {
        pets: petData,
        pages: pages,
        currentPage,
        isAdmin: true,
    });
}

async function getPetAdd(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    const user = new User();
    const userData = await user.getUserDetails(res.locals.uid);

    if (!userData.address) {
        res.redirect("/edit-profile");
        return;
    }

    res.render("users/add-pet");
}

async function getPetEdit(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== res.locals.uid && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.render("users/edit-pet", { petData });
}

async function addPet(req, res) {
    let {
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
    } = req.body;
    characteristics = characteristics ? characteristics : [];
    const uploadedImages = req.files;
    const userId = res.locals.uid;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
        return;
    }

    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const petData = {
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        images,
        uid: userId,
        address: {
            street: userData.address.street,
            city: userData.address.city,
            state: userData.address.state,
            country: userData.address.country,
            postalCode: userData.address.postalCode,
        },
    };

    try {
        const pet = new Pet(petData);
        pet.addPet(petData);
    } catch (err) {
        console.log(err);
    }

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function updatePet(req, res) {
    const petId = req.params.id;
    let {
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        description,
        street,
        city,
        state,
        country,
        postal,
    } = req.body;
    characteristics = characteristics != null ? characteristics : [];

    const uploadedImages = req.files;
    const userId = res.locals.uid;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== userId && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    const images = [];
    for (let image of uploadedImages) {
        images.push(image.path);
    }

    const updatePet = {
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        trained,
        health,
        characteristics,
        giveaway,
        price,
        description,
        address: {
            street: street,
            city: city,
            state: state,
            country: country,
            postalCode: postal,
        },
    };

    if (images.length > 0) {
        updatePet.images = images;
    }

    try {
        pet.updatePet(petData._id, updatePet);
    } catch (err) {
        console.log(err);
    }

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function deletePet(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    if (petData.uid !== res.locals.uid && !res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    const petDetails = await pet.getPetById(petId);

    for (let image of petDetails.images) {
        fs.unlink(image, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    pet.deletePet(petId);

    if (!res.locals.isAdmin) {
        res.redirect("/pet-profile");
        return;
    }

    res.redirect("/pets");
}

async function getPetDetails(req, res) {
    const petId = req.params.id;

    const pet = new Pet();
    const petData = await pet.getPetById(petId);

    if (!petData) {
        res.redirect("/pet-profile");
        return;
    }

    const similarPets = await pet.getSimilarCharacteristics(
        petData._id,
        petData.characteristics
    );

    res.render("users/pet-details", {
        petData: petData,
        similarPets: similarPets,
    });
}

async function getAdopt(req, res) {
    const petId = req.params.id;

    // Fetch Pet Details
    // Fetch Adopter Information
    // Populate data on Adoption Form
}

async function adoptPet(req, res) {
    const userId = res.locals.uid;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
        return;
    }

    // Store adoption form data on database
    // Notify Success to adopter
    // Add the form to his dashboard
    // Auto verify the form submitted
    // Show the form on owner's dashboard
}

async function getScheduleMeet(req, res) {
    // Get Adopter details
    // Show the time when owner is available
}

async function scheduleMeet(req, res) {
    // Get Adopter details
    // Show the time when owner is available
    // Send the data to owner for confirmation
}

module.exports = {
    getSearch,
    getByType,
    getByBreed,
    getPetProfiles,
    getPetDetails,
    getPetAdd,
    addPet,
    getPetEdit,
    updatePet,
    deletePet,
    getAdopt,
    adoptPet,
    getScheduleMeet,
    scheduleMeet,
};
