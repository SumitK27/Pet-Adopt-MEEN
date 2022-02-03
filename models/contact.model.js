const db = require("../data/database");

class Contact {
    constructor(name, email, message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }

    async save() {
        await db.getDb().collection("contacts").insertOne({
            name: this.name,
            email: this.email,
            message: this.message,
        });
    }

    async getAll() {
        const messages = await db
            .getDb()
            .collection("contacts")
            .find({})
            .toArray();

        return messages;
    }
}

module.exports = Contact;
