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

async function updateProfile(req, res) {
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
        postal,
    } = req.body;

    console.log(req.body);

    if (!res.locals.isAuth) {
        res.redirect("/login");
        return;
    }

    if (!res.locals.uid) {
        redirect("/login");
        return;
    }

    let user = new User();
    const userData = await user.getUserDetails(res.locals.uid);

    if (!userData) {
        res.redirect("/login");
    }

    user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
        userData.password
    );
    try {
        if (password && password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        if (oldPassword && !user.hasMatchingPassword(oldPassword)) {
            throw new Error("Old password is incorrect");
        }

        await user.updateUserDetails(
            res.locals.uid,
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
            postal
        );

        res.redirect("/profile");
        return;
    } catch (e) {
        console.log(e);
        return;
    }
}

module.exports = {
    getDashboard,
    getMyProfile,
    updateProfile,
};
