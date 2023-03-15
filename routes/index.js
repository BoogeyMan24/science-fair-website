const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("index.ejs", { title: ((Math.floor(Math.random() * (2 - 0) + 0)) == 0 ? "Fake" : "Real") });
});

module.exports = router;