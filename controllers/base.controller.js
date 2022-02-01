const Contact = require("../models/contact.model");

function getHome(req, res) {
    res.render("shared/index");
}

function getAbout(req, res) {
    res.render("shared/about");
}

function getContact(req, res) {
    res.render("shared/contact");
}

async function postContact(req, res) {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.render("shared/contact", {
            errorMessage: "All fields are required!",
        });
        return;
    }

    const contact = new Contact(name, email, message);

    try {
        await contact.save();
        res.redirect("/");
    } catch (error) {
        res.render("shared/contact", {
            errorMessage: "Something went wrong!",
        });
    }
}

module.exports = {
    getHome,
    getAbout,
    getContact,
    postContact,
};
