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

function getPetAdd(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    res.render("users/add-pet");
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
        images,
    } = req.body;
    const userId = res.locals.uid;

    const user = new User();
    const userData = await user.getUserDetails(userId);

    if (!userData) {
        res.redirect("/login");
        return;
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

module.exports = {
    getPetProfiles,
    getPetAdd,
    addPet,
};
