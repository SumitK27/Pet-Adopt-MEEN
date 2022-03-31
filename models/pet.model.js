const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Pets {
    constructor(
        name,
        age,
        gender,
        type,
        breed,
        size,
        coatLength,
        houseTrained,
        health,
        characteristics,
        sellOrDonate,
        price,
        image
    ) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.type = type;
        this.breed = breed;
        this.size = size;
        this.coatLength = coatLength;
        this.houseTrained = houseTrained;
        this.health = health;
        this.characteristics = characteristics;
        this.sellOrDonate = sellOrDonate;
        this.price = price;
        this.image = image;
    }

    async getCount() {
        const collection = await db.getDb().collection("pets");
        return await collection.countDocuments();
    }

    getAllPets(startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({})
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getMyPets(uid) {
        return db.getDb().collection("pets").find({ uid: uid }).toArray();
    }

    getPetById(pid) {
        return db
            .getDb()
            .collection("pets")
            .findOne({ _id: ObjectId(pid) });
    }

    addPet(pet) {
        return db.getDb().collection("pets").insertOne(pet);
    }

    deletePet(pid) {
        return db
            .getDb()
            .collection("pets")
            .deleteOne({ _id: ObjectId(pid) });
    }

    updatePet(pid, pet) {
        return db
            .getDb()
            .collection("pets")
            .updateOne({ _id: ObjectId(pid) }, { $set: pet });
    }

    getAllPetsByType(type, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ type: type })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsByBreed(breed, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ breed: breed })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    deleteMyPets(uid) {
        return db.getDb().collection("pets").deleteMany({ uid: uid });
    }

    getAllPetsByPrice(price, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ price: price })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }

    getAllPetsByGender(gender, startFrom, perPage) {
        return db
            .getDb()
            .collection("pets")
            .find({ gender: gender })
            .sort({ _id: -1 })
            .skip(startFrom)
            .limit(perPage)
            .toArray();
    }
}

module.exports = Pets;
