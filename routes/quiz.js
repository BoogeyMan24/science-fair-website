const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("quizmain.ejs");
});

router.get("/start", async (req, res) => {
	res.redirect(`/quiz/${createRandomId()}`);
});

router.get("/:id", async (req, res) => {
	res.render("quiz.ejs");
});

function createRandomId() {
	let id = Math.floor(Math.random() * (10 - 0) + 0);
	for (let i = 0; i < 19; i++) {
		id = id + Math.floor(Math.random() * (10 - 0) + 0).toString();
	}

	return id;
}

module.exports = router;