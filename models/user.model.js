const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const db = require("../data/database");

class User {
    constructor(
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        street,
        city,
        country,
        postal
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.address = {
            street: street,
            city: city,
            country: country,
            postalCode: postal,
        };
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
}

module.exports = User;
