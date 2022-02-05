const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const authUtil = require("../util/authentication");

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

// TODO: REDO THIS METHOD
async function updateProfile(req, res) {
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

    if (password && password !== confirmPassword) {
        throw new Error("Passwords do not match");
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
        if (oldPassword && !user.hasMatchingPassword(oldPassword)) {
            throw new Error("Old password is incorrect");
        }

        await user.updateUserDetails(
            res.locals.uid,
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
            image || userData.image
        );

        res.redirect("/profile");
        return;
    } catch (error) {
        console.log(error);
        return;
    }
}

async function deleteProfile(req, res) {
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

    const pet = new Pet();
    try {
        await pet.deleteMyPets(userData._id);
        // TODO: Delete Applications
        authUtil.destroyUserAuthSession(req);
        await user.deleteUser(userData._id);
    } catch (error) {
        console.log(error);
    }

    res.redirect("/login");
    return;
}

module.exports = {
    getDashboard,
    getMyProfile,
    updateProfile,
    deleteProfile,
};
