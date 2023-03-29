const express = require("express");
const userModel = require("../models/user");
const router = express.Router();


router.get("/", async (req, res) => {
	res.redirect("/");
	return;
	res.render("usermain.ejs");
});

router.post("/", async (req, res) => {
	res.redirect("/user");
	return;
	if (req.body.id == null || req.body.id.length < 21 || req.body.id.length > 21) {
		handleError(res, req, "doesntexist");
		return;
	}

	try {
		const id = parseInt(req.body.id);
		if (isNaN(id)) {
			handleError(res, req, "doesntexist");
			return;
		}

		const data = await userModel.findOne({ id: req.body.id });
		if (data == null) {
			handleError(res, req, "doesntexist");
			return;
		}

		// SUCCESS
		res.redirect(`/user/results/${req.body.id}`);
		return;
	} catch (e) {
		handleError(res, req, "doesntexist");
		return;
	}
});

router.get("/results", async (req, res) => {
	res.redirect("/");
	return;
	res.redirect("/user");
});

router.get("/results/:id", async (req, res) => {
	res.redirect("/");
	return;
	let userData = await userModel.findOne({ id: req.params.id });
	if (!userData) {
		res.redirect("/user");
		return;
	}
	userData = { id: userData.id, acceptedTerms: userData.acceptedTerms, verified: userData.verified, fullName: userData.fullName, class: userData.class, age: userData.age, confidence: userData.confidence, results: userData.results };
	// res.render("user.ejs", { id: req.params.id, answers: JSON.stringify(process.env.FAKE_ANSWERS), userData: JSON.stringify(userData) });
});

function handleError(res, req, error) {
	let errorMsg = "No Corresponding Error Message Found.";
	switch (error) {
	case "doesntexist":
		errorMsg = "That isn't a valid id. If this error persists speak to Petr/Adam.";
		break;
	}

	res.render("usermain.ejs", { error: errorMsg, id: req.body.id });
}


module.exports = router;