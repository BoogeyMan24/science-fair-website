let page = 1;
const numOfImages = 5;
const numOfPoems = 3;
const numOfPages = numOfImages + numOfPoems;

let mode = "images";

$(window).load(function() {
	page = 1;
	mode = "images";
	updatePage();
	setCorrectNum();
	setProgress();

	createQRCode();
});

function nextPage() {
	page++;
	updatePage();
}

function prevPage() {
	page--;
	updatePage();
}

function updatePage() {
	if (page == 1) {
		$("#prevButton").prop("disabled", true);
	} else if (page == numOfPages) {
		$("#nextButton").prop("disabled", true);
	} else {
		$("#prevButton").prop("disabled", false);
		$("#nextButton").prop("disabled", false);
	}

	if (page < 1) {
		page = 1;
	} else if (page > numOfPages) {
		page = numOfPages;
	}

	switchQuestion();

	if (page <= numOfImages && mode == "images") {
		updateImage();
	} else {
		updatePoem();
	}

	if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == answers[mode][(mode == "images" ? page : page - numOfImages) - 1]) {
		if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "real") {
			setRealCorrect();
		} else {
			setFakeCorrect();
		}
	} else if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "real") {
		setRealWrong();
	} else {
		setFakeWrong();
	}

	updateProgress();
}

function updatePageNum(pageNum) {
	if (userData.results[mode][(page <= numOfImages ? page : page - numOfImages) - 1].value == answers[mode][(page <= numOfImages ? page : page - numOfImages) - 1]) {
		$(`#${page}`).css("color", "rgb(0, 204, 0)");
	} else {
		$(`#${page}`).css("color", "rgb(255, 0, 0)");
	}
	page = pageNum;
	updatePage();
}

const prefix = "/demo/images/";
const suffix = ".png";

function updateImage() {
	$("#image").prop("src", prefix + (page - 1) + suffix);
}

async function updatePoem() {
	const poems = await fetch("/demo/poems/poems.json").then((response) => response.json());
	$("#poem").html("<span class=\"poemtitle lineheight\"> " + poems[page - numOfImages - 1].name + "</span> <br> <span class=\"poemtext lineheight\"> " + poems[page - numOfImages - 1].poem + "</span>");
}

function switchQuestion() {
	if (page <= numOfImages) {
		mode = "images";
		$("#poem").css("display", "none");
		$("#image").css("display", "inline");
	} else if (page > numOfImages) {
		mode = "poems";
		$("#poem").css("display", "block");
		$("#image").css("display", "none");
	}
}

function setCorrectNum() {
	const correctNum = getNumOfCorrect();
	$("#correctNum").text(correctNum);
	$("#correctPercentage").text(Math.round(correctNum * 100 / numOfPages));
	$("#correctPercentageConfidence").text(userData.confidence);
}

let numOfCorrect = 0;

function getNumOfCorrect() {
	numOfCorrect = 0;
	for (let i = 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (userData.results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == answers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
			numOfCorrect++;
		}
	}
	return numOfCorrect;
}

function setProgress() {
	for (let i = 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (i == 1) {
			$(`#${i}`).css("color", "rgb(255, 153, 0)");
		} else if (userData.results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == answers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
			$(`#${i}`).css("color", "rgb(0, 204, 0)");
		} else {
			$(`#${i}`).css("color", "rgb(255, 0, 0)");
		}
	}
}

function updateProgress() {
	for (let i = 0; i < 3; i++) {
		const current = (page + 1) - i;
		const localMode = current < numOfImages ? "images" : "poems";
		if (userData.results[localMode][(current < numOfImages ? current : current - numOfImages) - 1] != null) {
			if (current == page) {
				$(`#${current}`).css("color", "rgb(255, 153, 0)");
			} else if (userData.results[localMode][(current < numOfImages ? current : current - numOfImages) - 1].value == answers[localMode][(current < numOfImages ? current : current - numOfImages) - 1]) {
				$(`#${current}`).css("color", "rgb(0, 204, 0)");
			} else {
				$(`#${current}`).css("color", "rgb(255, 0, 0)");
			}
		}
	}
}

function unsetFakeReal() {
	$("#buttonFakeWrap").removeClass("wrong correct");
	$("#buttonRealWrap").removeClass("wrong correct");
}

function setRealCorrect() {
	unsetFakeReal();
	$("#buttonRealWrap").addClass("correct");
}

function setRealWrong() {
	unsetFakeReal();
	$("#buttonRealWrap").addClass("wrong");
}

function setFakeCorrect() {
	unsetFakeReal();
	$("#buttonFakeWrap").addClass("correct");
}

function setFakeWrong() {
	unsetFakeReal();
	$("#buttonFakeWrap").addClass("wrong");
}


function createQRCode() {
	new QRCode(document.getElementById("qrcode"), {
		text: `https://isitreal.uk/demo/results/${id}`,
		width: (0.09 * screen.width),
		height: (0.09 * screen.width),
	});
}