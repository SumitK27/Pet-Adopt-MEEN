const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const db = require("../data/database");

class User {
    constructor(firstName, lastName, email, phoneNumber, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }

    getUserWithSameEmail() {
        return db.getDb().collection("users").findOne({ email: this.email });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }

        return false;
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection("users").insertOne({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            password: hashedPassword,
            isAdmin: false,
        });
    }

    async getUserDetails(uid) {
        const userId = ObjectId(uid);
        const user = await db
            .getDb()
            .collection("users")
            .findOne({ _id: userId });

        if (!user) {
            return null;
        }

        return user;
    }

    async updateUserDetails(
        uid,
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
        image
    ) {
        const userId = ObjectId(uid);
        const user = await db
            .getDb()
            .collection("users")
            .findOne({ _id: userId });

        if (!user) {
            return null;
        }

        if (password && password !== confirmPassword) {
            return {
                errorMessage: "Passwords do not match",
            };
        }

        if (oldPassword && !user.hasMatchingPassword(oldPassword)) {
            return {
                errorMessage: "Old password is incorrect",
            };
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            await db
                .getDb()
                .collection("users")
                .updateOne(
                    { _id: userId },
                    {
                        $set: {
                            firstName,
                            middleName,
                            lastName,
                            dob,
                            email,
                            phoneNumber,
                            password: hashedPassword,
                            address: {
                                street,
                                city,
                                state,
                                country,
                                postalCode: postal,
                            },
                        },
                    }
                );
        } else {
            if (!image) {
                await db
                    .getDb()
                    .collection("users")
                    .updateOne(
                        { _id: userId },
                        {
                            $set: {
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
                            },
                        }
                    );
            }
            await db
                .getDb()
                .collection("users")
                .updateOne(
                    { _id: userId },
                    {
                        $set: {
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
                            image,
                        },
                    }
                );
        }

        return {
            success: true,
        };
    }

    async getAllUsers() {
        const users = await db.getDb().collection("users").find({}).toArray();

        return users;
    }

    async deleteUser(uid) {
        const userId = ObjectId(uid);
        const user = await db
            .getDb()
            .collection("users")
            .findOne({ _id: userId });

        if (!user) {
            return null;
        }

        try {
            await db.getDb().collection("users").deleteOne({ _id: userId });
        } catch (error) {
            console.log(error);
            return;
        }

        if (!res.locals.isAdmin) {
            res.redirect("/");
            return;
        }

        res.redirect("/users");
        return {
            success: true,
        };
    }
}

module.exports = User;
