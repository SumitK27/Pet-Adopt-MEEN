require("dotenv").config();
const PORT = process.env.PORT || 3000;
const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

// Config Imports
const createSessionConfig = require("./config/session");
const db = require("./data/database");

// Middleware Imports
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatus = require("./middlewares/check-auth");

// Route Imports
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const usersRoutes = require("./routes/users.routes");
// const adminRoutes = require("./routes/admin.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Generate and check for incoming tokens
app.use(csrf());

// Distribute token to all routes and views
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatus);

// Routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(usersRoutes);
// app.use("/admin", adminRoutes);

// Error Handling Middleware
app.use(errorHandlerMiddleware);

db.connectToDatabase()
    .then(function () {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(function (error) {
        console.log("Failed to connect to the database!");
        console.log(error);
    });
