const express = require("express");
const userModel = require("../models/user.js")
const router = express.Router();

router.get("/", async (req, res) => {
	res.render("chart.ejs", { allData: JSON.stringify(await userModel.find({ verified: true })), answers: JSON.stringify(process.env.ANSWERS) });
});

module.exports = router;