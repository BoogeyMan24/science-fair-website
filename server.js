require("dotenv").config();

/* --------------------DEAL WITH EXPRESS-------------------- */
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

/* --------------------DEAL WITH DATABASE-------------------- */
const mongoose = require("mongoose");

// CONNECT TO DATABSE:
mongoose.set("strictQuery", false);
(async () => {
	await mongoose.connect(process.env.MONGODB_URL).catch(console.error);
})();

// PRINT ERROR/CONNECTION
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("Connected to Database"));

/* --------------------DEAL WITH APP ROUTES-------------------- */
// const indexRouter = require("./routes/index.ejs");

app.use("/quiz", (req, res) => {
	res.render("quiz.ejs");
});

app.use("/", (req, res) => {
	res.render("index.ejs");
});


app.listen(process.env.PORT);