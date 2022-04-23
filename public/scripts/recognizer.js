const breedInput = document.getElementById("breedInput");
const breedOutput = document.getElementById("breedOutput");
const imagePreview = document.getElementById("image-preview");

let model;

// Load the model.
async function init() {
    const modelURL = "./model/model.json";
    const metadataURL = "./model/metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    console.log("%cModel Loaded!", "color: #7FDBFF; font-weight: bold;");
}

init();

breedInput.addEventListener("change", async (e) => {
    if (e.target.files.length > 0) {
        const src = URL.createObjectURL(e.target.files[0]);
        imagePreview.classList.remove("hidden");
        imagePreview.src = src;

        // Detect Breed from image
        const breedName = await classify(imagePreview);
        // console.log(breedName);

        // Display Breed
        if (breedName) {
            breedOutput.classList.remove("hidden");
            breedOutput.classList.remove("bg-red-500");
            breedOutput.classList.add("block");
            breedOutput.href = `/info/animal/${breedName}`;
            breedOutput.innerText = breedName;
        } else {
            breedOutput.classList.add("bg-red-500");
            breedOutput.innerText = "No breed detected";
            breedOutput.href = "";
        }
    } else {
        imagePreview.classList.add("hidden");
    }
});

async function classify(image) {
    const predictions = await model.predict(image);
    return predictions.sort((a, b) => b.probability - a.probability)[0]
        .className;
}
