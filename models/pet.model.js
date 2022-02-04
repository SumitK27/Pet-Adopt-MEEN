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
}

module.exports = Pets;
