const User = require("../models/user.model");

function getDashboard(req, res) {
    if (res.locals.isAuth && res.locals.isAdmin) {
        res.render("admin/dashboard");
    } else if (res.locals.isAuth) {
        res.render("users/dashboard");
    } else {
        res.redirect("/login");
    }
}

async function getMyProfile(req, res) {
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

    if (!userData) {
        res.redirect("/login");
    }

    if (!res.locals.isAdmin) {
        res.render("shared/profile", { userData });
        return;
    }
    res.render("shared/profile", { userData });
}

module.exports = {
    getDashboard,
    getMyProfile,
};
