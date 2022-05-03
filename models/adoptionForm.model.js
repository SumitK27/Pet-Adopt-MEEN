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

    getMySubmittedForms(adopterId) {
        return db
            .getDb()
            .collection("adoptionForm")
            .find({ adopterId: adopterId })
            .toArray();
    }

    getMyReceivedForms(ownerId) {
        return db
            .getDb()
            .collection("adoptionForm")
            .find({ ownerId: ownerId })
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
        return result.insertedId.toString();
    }

    async acceptApplication(formId) {
        const collection = await db.getDb().collection("adoptionForm");
        const result = await collection.updateOne(
            { _id: ObjectId(formId) },
            { $set: { userStatus: "Approved" } }
        );
        return result.modifiedCount;
    }

    async rejectApplication(formId) {
        const collection = await db.getDb().collection("adoptionForm");
        const result = await collection.updateOne(
            { _id: ObjectId(formId) },
            { $set: { userStatus: "Rejected" } }
        );
        return result.modifiedCount;
    }

    async deleteApplication(formId) {
        const collection = await db.getDb().collection("adoptionForm");
        const result = await collection.deleteOne({ _id: ObjectId(formId) });
        return result.deletedCount;
    }
}

module.exports = Adoption;
