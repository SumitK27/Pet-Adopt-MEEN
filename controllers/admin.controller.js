const Contact = require("../models/contact.model");
const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const Animal = require("../models/animal.model");
const db = require("../data/database");
const bcrypt = require("bcrypt");
const pagination = require("../util/pagination");

async function getAllMessages(req, res) {
    const currentPage = req.query.page;

    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let messages;
    let totalPages;
    try {
        const contact = new Contact();
        const count = await contact.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 1);

        messages = await contact.getAll(startFrom, perPage);
        totalPages = pages;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/messages", { messages, pages: totalPages, currentPage });
}

async function getMessage(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let message;
    try {
        const contact = new Contact();
        message = await contact.getById(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/message", { message });
}

async function deleteMessage(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const contact = new Contact();
        await contact.delete(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/messages");
}

async function getAllUsers(req, res) {
    const currentPage = req.query.page;

    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let users;
    let totalPages;
    try {
        const user = new User();
        const count = await user.getCount();
        const { startFrom, perPage, pages } = pagination(count, currentPage, 4);

        users = await user.getAllUsers(startFrom, perPage);
        totalPages = pages;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/users", { users, pages: totalPages, currentPage });
}

async function getUserDetails(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let userData;
    try {
        const userId = req.params.id;
        const user = new User();
        userData = await user.getUserDetails(userId);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/user", { userData });
}

async function updateUserDetails(req, res) {
    const userId = req.params.id;
    const {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        oldPassword,
        password,
        confirmPassword,
        street,
        city,
        state,
        country,
        postal,
    } = req.body;
    const uploadedImage = req.file;
    let image = null;

    const enteredData = {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        oldPassword,
        password,
        confirmPassword,
        address: {
            street,
            city,
            state,
            country,
            postalCode: postal,
        },
    };

    if (uploadedImage) {
        image = uploadedImage.path;
    }
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let user = new User();

    if (password && password !== confirmPassword) {
        console.log("Passwords do not match");
        res.render("admin/user", {
            error: "Passwords do not match.",
            userData: enteredData,
        });
        return;
    }

    const updatedUser = {
        firstName,
        middleName,
        lastName,
        dob,
        email,
        phoneNumber,
        address: {
            street,
            city,
            state,
            country,
            postalCode: postal,
        },
    };

    if (image) {
        updatedUser.image = image;
    }

    if (password) {
        updatedUser.password = await bcrypt.hash(password, 12);
    }

    try {
        await user.updateUser(userId, updatedUser);
        res.redirect("/users");
        return;
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }
}

async function deleteUser(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const pet = new Pet();
        await pet.deleteMyPets(req.params.id);
        await db
            .getDb()
            .collection("sessions")
            .deleteOne({ "session.uid": req.params.id });
        const user = new User();
        await user.deleteUser(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/users");
}

async function getAllAnimals(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let animals;
    try {
        let animalObj = new Animal();
        animals = await animalObj.getAllAnimals();
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/animals", { animalData: animals });
}

async function getAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let animal;
    try {
        const animalObj = new Animal();
        animal = await animalObj.getAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/animal", { animalData: animal });
}

function getAddAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    res.render("admin/add-animal");
}

async function addAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const { name, species, breed, age } = req.body;

    const animal = {
        name,
        species,
        breed,
        age,
    };

    try {
        const animalObj = new Animal();
        await animalObj.addAnimal(animal);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

async function getUpdateAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    let animal;
    try {
        const animalObj = new Animal();
        animal = await animalObj.getAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/animal", { animalData: animal });
}

async function updateAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    const { name, species, breed, age } = req.body;

    const animal = {
        name,
        species,
        breed,
        age,
    };

    try {
        const animalObj = new Animal();
        await animalObj.updateAnimal(req.params.id, animal);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

async function deleteAnimal(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("error/401");
        return;
    }

    try {
        const animalObj = new Animal();
        await animalObj.deleteAnimal(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/animals");
}

module.exports = {
    getAllMessages,
    getMessage,
    deleteMessage,
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    getAllAnimals,
    getAnimal,
    getAddAnimal,
    addAnimal,
    getUpdateAnimal,
    updateAnimal,
    deleteAnimal,
};
