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

    getAllPets() {
        return db.getDb().collection("pets").find({}).toArray();
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

    getAllPetsByType(type) {
        return db.getDb().collection("pets").find({ type: type }).toArray();
    }

    getAllPetsByBreed(breed) {
        return db.getDb().collection("pets").find({ breed: breed }).toArray();
    }

    deleteMyPets(uid) {
        return db.getDb().collection("pets").deleteMany({ uid: uid });
    }

    getAllPetsByPrice(price) {
        return db.getDb().collection("pets").find({ price: price }).toArray();
    }

    getAllPetsByGender(gender) {
        return db.getDb().collection("pets").find({ gender: gender }).toArray();
    }
}

module.exports = Pets;
