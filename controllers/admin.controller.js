const Contact = require("../models/contact.model");
const User = require("../models/user.model");

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
        res.render("shared/401");
        return;
    }

    let messages;
    try {
        const contact = new Contact();
        messages = await contact.getAll();
    } catch (error) {
        console.log(error);
        res.render("shared/500");
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
        res.render("shared/401");
        return;
    }

    let message;
    try {
        const contact = new Contact();
        message = await contact.getById(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("shared/500");
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
        res.render("shared/401");
        return;
    }

    try {
        const contact = new Contact();
        await contact.delete(req.params.id);
    } catch (error) {
        console.log(error);
        res.render("shared/500");
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
        res.render("shared/401");
        return;
    }

    let users;
    try {
        const user = new User();
        users = await user.getAllUsers();
    } catch (error) {
        console.log(error);
        res.render("shared/500");
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
        res.render("shared/401");
        return;
    }

    let userData;
    try {
        const userId = req.params.id;
        const user = new User();
        userData = await user.getUserDetails(userId);
    } catch (error) {
        console.log(error);
        res.render("shared/500");
        return;
    }

    res.render("admin/user", { userData });
}

async function updateUserDetails(req, res) {
    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    if (!res.locals.isAdmin) {
        res.render("shared/401");
        return;
    }

    let userData;
    try {
        const userId = req.params.id;
        const user = new User();
        userData = await user.getUserDetails(userId);

        const {
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            oldPassword,
            password,
            confirmPassword,
            street,
            city,
            state,
            country,
            postalCode,
        } = req.body;

        await user.updateUserDetails(
            userId,
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            oldPassword,
            password,
            confirmPassword,
            street,
            city,
            state,
            country,
            postalCode
        );
    } catch (error) {
        console.log(error);
        res.render("shared/500");
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
};
