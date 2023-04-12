const express = require("express");
const demoModel = require("../models/demouser");
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("demo.ejs");
});

router.post("/submit", async (req, res) => {
	if (!req.body || !req.body.id) {
		return;
	}

	const results = { images: req.body.images, poems: req.body.poems }

	try {
		const user = await demoModel.create({
			id: req.body.id,
			verified: false,

			results: results,
		});
		await user.save().then(() => {
			res.send({ success: true });
		});
	} catch (e) {
		return;
	}
});

router.get("/results/:id", async (req, res) => {
	let userData = await demoModel.findOne({ id: req.params.id });
	if (!userData) {
		// res.redirect("/demo");
		return;
	}
	userData = { id: userData.id, acceptedTerms: userData.acceptedTerms, verified: userData.verified, fullName: userData.fullName, class: userData.class, age: userData.age, confidence: userData.confidence, results: userData.results };
	res.render("demoresults.ejs", { id: req.params.id, answers: JSON.stringify(process.env.DEMO), userData: JSON.stringify(userData) });
});

module.exports = router;