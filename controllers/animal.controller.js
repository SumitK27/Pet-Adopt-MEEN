const Animal = require("../models/animal.model");

async function getAnimals(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAllAnimals();
    res.render("users/animals", { animalData });
}

async function getAnimal(req, res) {
    const animal = new Animal();
    const animalData = await animal.getAnimal(req.params.id);
    res.render("users/animal", { animalData });
}

module.exports = {
    getAnimals,
    getAnimal,
};
