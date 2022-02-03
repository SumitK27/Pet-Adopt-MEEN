const Contact = require("../models/contact.model");

async function getMessages(req, res) {
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

module.exports = {
    getMessages,
};
