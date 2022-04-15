const breedInput = document.getElementById("breedInput");
const breedOutput = document.getElementById("breedOutput");
const imagePreview = document.getElementById("image-preview");

breedInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        const src = URL.createObjectURL(e.target.files[0]);
        imagePreview.classList.remove("hidden");
        imagePreview.src = src;

        // Detect Breed from image
        const breedName = "Havanese";
        breedOutput.classList.remove("hidden");
        breedOutput.classList.add("block");
        breedOutput.href = `/info/animal/${breedName}`;
        breedOutput.innerText = breedName;
    } else {
        imagePreview.classList.add("hidden");
    }
});
