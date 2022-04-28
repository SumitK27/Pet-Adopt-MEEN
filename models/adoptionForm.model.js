const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Adoption {
    async getCount() {
        const collection = await db.getDb().collection("adoptionForm");
        return await collection.countDocuments();
    }

    getAllForms() {
        return db.getDb().collection("adoptionForm").find({}).toArray();
    }

    getMySubmittedForms(userId) {
        return db
            .getDb()
            .collection("adoptionForm")
            .find({ userId: userId })
            .toArray();
    }

    getMyReceivedForms(userId) {
        return db
            .getDb()
            .collection("adoptionForm")
            .find({ adopterId: userId })
            .toArray();
    }

    getFormById(id) {
        return db
            .getDb()
            .collection("adoptionForm")
            .findOne({ _id: ObjectId(id) });
    }

    getFormByPetId(petId) {
        return db
            .getDb()
            .collection("adoptionForm")
            .findOne({ petId: ObjectId(petId) });
    }

    async createForm(form) {
        const collection = await db.getDb().collection("adoptionForm");
        const result = await collection.insertOne(form);
        return result.insertedId;
    }
}

module.exports = Adoption;
