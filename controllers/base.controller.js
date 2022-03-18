const Contact = require("../models/contact.model");
const Pet = require("../models/pet.model");
const Animal = require("../models/animal.model");
const sessionFlash = require("../util/session-flash");

function getHome(req, res) {
    res.render("shared/index");
}

function getAbout(req, res) {
    res.render("shared/about");
}

async function getSearch(req, res) {
    const pet = new Pet();
    const petData = await pet.getAllPets();
    res.render("users/search", { petData });
}

async function getDogs(req, res) {
    const pet = new Pet();
    const petData = await pet.getAllPetsByType("dog");
    res.render("users/search", { petData });
}

async function getCats(req, res) {
    const pet = new Pet();
    const petData = await pet.getAllPetsByType("cat");
    res.render("users/search", { petData });
}

function getContact(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            name: "",
            email: "",
            message: "",
        };
    }

    res.render("shared/contact", { inputData: sessionData });
}

async function postContact(req, res) {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.render("shared/contact", {
            inputData: {
                errorMessage: "All fields are required!",
                name,
                email,
                message,
            },
        });
        return;
    }

    const contact = new Contact(name, email, message);

    try {
        await contact.save();
        res.redirect("/");
    } catch (error) {
        res.render("shared/contact", {
            inputData: {
                errorMessage: "Something went wrong!",
                name,
                email,
                message,
            },
        });
    }
}

async function getAnimals(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAllAnimals();
    res.render("users/animals", { animalData });
}

async function getAnimal(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAnimal(req.params.id);
    res.render("users/animal", { animalData });
}

async function getBreed(req, res) {
    const animal = new Animal();
    const animalData = await animal.getBreed(req.params.breed);
    res.render("users/animal", { animalData });
}

// TODO: Remove this function
function getAdoptForm(req, res) {
    res.render("users/adoption-form");
}

module.exports = {
    getHome,
    getAbout,
    getContact,
    postContact,
    getSearch,
    getDogs,
    getCats,
    getAnimals,
    getAnimal,
    getBreed,
    getAdoptForm,
};
