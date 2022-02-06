const Contact = require("../models/contact.model");
const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const db = require("../data/database");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

async function getAllMessages(req, res) {
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
    try {
        const contact = new Contact();
        messages = await contact.getAll();
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/messages", { messages });
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
    try {
        const user = new User();
        users = await user.getAllUsers();
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.render("admin/users", { users });
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
        redirect("/login");
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
        user.updateUser(userId, updatedUser);
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
        await db
            .getDb()
            .collection("users")
            .deleteOne({ _id: ObjectId(req.params.id) });
    } catch (error) {
        console.log(error);
        res.render("error/500");
        return;
    }

    res.redirect("/users");
}

module.exports = {
    getAllMessages,
    getMessage,
    deleteMessage,
    getAllUsers,
    getUserDetails,
    updateUserDetails,
    deleteUser,
};
