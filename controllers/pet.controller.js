const fs = require("fs");
const Pet = require("../models/pet.model");
const User = require("../models/user.model");

async function getPetProfiles(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    const pet = new Pet();

    if (!res.locals.isAdmin) {
        const petData = await pet.getMyPets(res.locals.uid);

        res.render("shared/pets", { pets: petData, isAdmin: false });
        return;
    }

    const petData = await pet.getAllPets();
    res.render("shared/pets", { pets: petData, isAdmin: true });
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
    const {
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
    const {
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
        street,
        city,
        state,
        country,
        postal
    } = req.body;
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

module.exports = {
    getPetProfiles,
    getPetAdd,
    addPet,
    getPetEdit,
    updatePet,
    deletePet,
};
