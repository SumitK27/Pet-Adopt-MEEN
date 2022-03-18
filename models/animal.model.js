const db = require("../data/database");

class Animal {
    constructor() {}

    async getAllAnimals() {
        let animals = await db.getDb().collection("animals").find().toArray();
        return animals;
    }

    async getAnimal(id) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ _id: id });
        return animal;
    }

    async addAnimal(animal) {
        let result = await db.getDb().collection("animals").insertOne(animal);
        return result;
    }

    async updateAnimal(id, animal) {
        let result = await db
            .getDb()
            .collection("animals")
            .updateOne({ _id: id }, { $set: animal });
        return result;
    }

    async deleteAnimal(id) {
        let result = await db
            .getDb()
            .collection("animals")
            .deleteOne({ _id: id });
        return result;
    }

    async getAnimalByName(name) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ name: name });
        return animal;
    }

    async getAnimalByBreed(breed) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ breed: breed });
        return animal;
    }

    async getAnimalBySpecies(species) {
        let animal = await db
            .getDb()
            .collection("animals")
            .findOne({ species: species });
        return animal;
    }
}

module.exports = Animal;
