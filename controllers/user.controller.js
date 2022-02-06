const User = require("../models/user.model");
const Pet = require("../models/pet.model");
const authUtil = require("../util/authentication");
const bcrypt = require("bcrypt");

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

    if (password && password !== confirmPassword) {
        console.log("Passwords do not match");
        res.render("shared/profile", {
            error: "Passwords do not match.",
            userData: enteredData,
        });
        return;
    }

    let user = new User();
    const userData = await user.getUserDetails(res.locals.uid);

    if (!userData) {
        res.redirect("/login");
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

    const passwordIsRight = await bcrypt.compare(
        oldPassword,
        userData.password
    );

    if (oldPassword && !passwordIsRight) {
        console.log("Old password does not match");
        res.render("shared/profile", {
            error: "Old password is incorrect.",
            userData: enteredData,
        });
        return;
    }

    if (password) {
        updatedUser.password = await bcrypt.hash(password, 12);
    }

    if (image) {
        updatedUser.image = image;
    }

    try {
        await user.updateUser(res.locals.uid, updatedUser);
        res.redirect("/profile");
    } catch (error) {
        res.render("shared/profile", {
            error: error.message,
            userData: enteredData,
        });
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
