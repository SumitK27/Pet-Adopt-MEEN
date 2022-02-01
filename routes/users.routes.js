const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
    if (res.locals.isAdmin) {
        res.render("admin/dashboard");
    } else {
        res.render("users/dashboard");
    }
});

module.exports = router;
