const fs = require("fs");
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

    async getCount() {
        const collection = await db.getDb().collection("users");
        return await collection.countDocuments({ isAdmin: false });
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

    async updateUser(uid, user) {
        const userId = ObjectId(uid);
        await db
            .getDb()
            .collection("users")
            .updateOne({ _id: userId }, { $set: user });
    }

    async getAllUsers() {
        const users = await db.getDb().collection("users").find({ isAdmin: false }).toArray();

        return users;
    }

    async deleteUser(uid) {
        const userData = await this.getUserDetails(uid);
        fs.unlinkSync(userData.image);
        await db
            .getDb()
            .collection("users")
            .deleteOne({ _id: ObjectId(uid) });
    }
}

module.exports = User;
