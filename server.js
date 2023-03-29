require("dotenv").config();


/* --------------------DEAL WITH EXPRESS-------------------- */
const express = require("express");
const app = express();
const favicon = require("serve-favicon");
const path = require("path");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));


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
// db.once("open", () => console.log("Connected to Database"));


/* --------------------DEAL WITH APP ROUTES-------------------- */
const indexRouter = require("./routes/index.js");
const quizRouter = require("./routes/quiz.js");
const userRouter = require("./routes/user.js");

app.use("/", indexRouter);
app.use("/quiz", quizRouter);
app.use("/user", userRouter);


app.listen(process.env.PORT);