const express = require("express");
const { readFileSync, writeFileSync } = require("fs");
const userModel = require("../models/user");
const router = express.Router();
const path = require("path");

const idLength = 20;

router.get("/", async (req, res) => {
	res.render("quizmain.ejs");
});

const format = /[`0123456789!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
router.post("/", async (req, res) => {
	const id = createRandomId();

	const count = readFileSync(path.join(process.cwd(), "count.txt"), "utf-8");
	const newCount = parseInt(count) + 1;

	writeFileSync(path.join(process.cwd(), "count.txt"), newCount.toString());


	if (req.body.acceptedTerms == null) {
		handleError(res, req, "noterms");
		return;
	}
	if (format.test(req.body.fullName) || req.body.fullName.toString().trim() == "") {
		handleError(res, req, "invalidname");
		return;
	}
	try {
		const grade = parseInt(req.body.class);
		if (grade < 7 || grade > 12) {
			handleError(res, req, "invalidclass");
			return;
		}
	} catch (e) {
		handleError(res, req, "invalidclass");
		return;
	}
	try {
		const age = parseInt(req.body.age);
		if (age < 1 || age > 100) {
			handleError(res, req, "invalidage");
			return;
		}
	} catch (e) {
		handleError(res, req, "invalidage");
		return;
	}
	try {
		const confidence = parseInt(req.body.confidence);
		if (confidence < 0 || confidence > 100) {
			handleError(res, req, "invalidconfidence");
			return;
		}
	} catch (e) {
		handleError(res, req, "invalidconfidence");
		return;
	}

	try {
		const user = await userModel.create({
			id: id,
			acceptedTerms: (req.body.acceptedTerms == "on" ? true : false),

			fullName: req.body.fullName.trim().replace(/\s+/g, "-").toLowerCase(),
			class: req.body.class,
			age: req.body.age,
			confidence: req.body.confidence,
		});
		await user.save();

		res.redirect(`/quiz/${newCount}?form=${id}`);
	} catch (e) {
		handleError(res, req, "alreadyexists");
		return;
	}
});

router.get("/thanks", async (req, res) => {
	let userData;
	if (req.query.form == null) {
		res.redirect("/");
		return;
	} else {
		userData = await userModel.findOne({ id: req.query.form });
		if (userData == null) {
			res.redirect("/");
			return;
		} else if (userData.results == null) {
			res.redirect("/");
			return;
		}
	}

	res.send(`Thanks for participating! You will be able to get your results after the science fair. To get results: you will either have to ask Adam/Petr at the science fair or hold on to your id (${req.query.form}) and access a link (that will be revealed at the science fair) using that id.`);
});

router.post("/submit", async (req, res) => {
	let userData;
	if (req.body.id == null) {
		res.redirect("/");
		return;
	} else {
		userData = await userModel.findOne({ id: req.body.id });
		if (userData == null) {
			res.redirect("/");
			return;
		}
		if (userData.results != null) {
			res.redirect("/");
			return;
		}
	}

	delete req.body.id;
	await userData.updateOne({
		$set: {
			results: req.body,
		},
	}).then(() => {
		res.send({ success: true });
	});

	return 0;
});

router.get("/:id", async (req, res) => {
	const userData = await userModel.findOne({ id: req.query.form });
	if (userData == null || userData.results != null) {
		res.redirect("/");
		return;
	}

	res.render("quiz.ejs");
});

function handleError(res, req, error) {
	let errorMsg = "No Corresponding Error Message Found.";
	switch (error) {
	case "alreadyexists":
		errorMsg = "That person is already registered.";
		break;
	case "noterms":
		errorMsg = "You must accept the terms to proceed.";
		break;
	case "invalidname":
		errorMsg = "Invalid name. Make sure the name field doesn't have any special characters.";
		break;
	case "invalidclass":
		errorMsg = "Invalid class. The only valid classes are grade 7-12.";
		break;
	case "invalidage":
		errorMsg = "Invalid age. Make sure the age field is a number and that it is between 1 and 99.";
		break;
	case "invalidconfidence":
		errorMsg = "Invalid percentage. Make sure the percentage is between 0 and 100.";
		break;
	}

	res.render("quizmain.ejs", { error: errorMsg, fullName: req.body.fullName, class: req.body.class, age: req.body.age, confidence: req.body.confidence });
}

function createRandomId() {
	let id;
	for (let i = 0; i < idLength; i++) {
		id = (id == null ? Math.floor(Math.random() * (10 - 0) + 0).toString() : id) + Math.floor(Math.random() * (10 - 0) + 0).toString();
	}

	return id;
}

module.exports = router;