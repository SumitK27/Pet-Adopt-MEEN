require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Third-party Imports
const express = require("express");
const cors = require("cors");

const app = express();
const corsOption = {
    origin: "http://localhost:3000",
};

app.set("view engine", "ejs");
app.set("views", "views");

// Middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
const baseRoute = require("./routes/base.route");

app.use("/", baseRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
