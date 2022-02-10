const Contact = require("../models/contact.model");
const Pet = require("../models/pet.model");
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

function getDetails(req, res) {
    res.render("users/pet-details");
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

module.exports = {
    getHome,
    getAbout,
    getContact,
    postContact,
    getSearch,
    getDetails,
};
