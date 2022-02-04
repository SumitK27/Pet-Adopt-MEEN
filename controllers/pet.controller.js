const Pet = require("../models/pet.model");

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

    res.render("users/add-pets");
}

module.exports = {
    getPetProfiles,
    getPetAdd,
};
