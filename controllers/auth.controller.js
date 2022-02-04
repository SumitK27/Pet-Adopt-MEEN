const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
    if (res.locals.isAuth) {
        res.redirect("/profile");
        return;
    }

    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        };
    }

    res.render("auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
    } = req.body;
    const enteredData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
    };

    // Validation
    if (
        !validation.userDetailsAreValid(
            firstName,
            lastName,
            email,
            phoneNumber,
            password
        )
    ) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    "Please check your inputs. Some fields are empty or invalid.",
                ...enteredData,
            },
            function () {
                res.redirect("/signup");
            }
        );
        return;
    }
    if (!validation.passwordIsConfirmed(password, confirmPassword)) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage: "Password and Confirm Password doesn't match",
                ...enteredData,
            },
            function () {
                res.redirect("/signup");
            }
        );
        return;
    }

    const user = new User(firstName, lastName, email, phoneNumber, password);

    // Error Handling
    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage:
                        "User exists already. Try logging in instead!",
                    ...enteredData,
                },
                function () {
                    res.redirect("/signup");
                }
            );
            return;
        }

        await user.signup();
    } catch (error) {
        return next(error);
    }

    res.redirect("/login");
}

function getLogin(req, res, next) {
    if (res.locals.isAuth) {
        res.redirect("/profile");
        return;
    }

    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: "",
            password: "",
        };
    }

    res.render("auth/login", { inputData: sessionData });
}

async function login(req, res) {
    const user = new User(null, null, req.body.email, null, req.body.password);
    let existingUser;

    // Error Handling
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        return next(error);
    }

    const sessionErrorData = {
        errorMessage: "Invalid Email or Password",
        email: user.email,
        password: user.password,
    };

    // Check if user with email exists
    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect("/login");
        });
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(
        existingUser.password
    );

    // Check if Password is correct
    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect("/login");
        });
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect("/profile");
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect("/login");
}

module.exports = {
    getSignup,
    getLogin,
    signup,
    login,
    logout,
};
