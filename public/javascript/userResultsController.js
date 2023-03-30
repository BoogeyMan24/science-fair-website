let page = 1;
const numOfImages = 20;
const numOfPoems = 6;
const numOfPages = numOfImages + numOfPoems;

let mode = "images";

$(window).load(function() {
	page = 1;
	mode = "images";
	updatePage();
	setCorrectNum();
	setProgress();
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

	switchQuestion();

	if (page <= numOfImages && mode == "images") {
		updateImage();
	} else {
		updatePoem();
	}

	if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == fakeAnswers[mode][(mode == "images" ? page : page - numOfImages) - 1]) {
		if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "real") {
			setRealCorrect();
		} else {
			setFakeCorrect();
		}
	} else if (userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "real") {
		setRealWrongFakeCorrect();
	} else {
		setFakeWrongRealCorrect();
	}

	if (page == 1) {
		$("#timespent").text("Unavailavable for this page");
	} else {
		$("#timespent").text((userData.results[mode][(mode == "images" ? page : page - numOfImages) - 1].timeSpent / 1000).toFixed(2) + "s");
	}

	updateProgress();
}

function updatePageNum(pageNum) {
	if (userData.results[mode][(page <= numOfImages ? page : page - numOfImages) - 1].value == fakeAnswers[mode][(page <= numOfImages ? page : page - numOfImages) - 1]) {
		$(`#${page}`).css("color", "rgb(0, 204, 0)");
	} else {
		$(`#${page}`).css("color", "rgb(255, 0, 0)");
	}
	page = pageNum;
	updatePage();
}

const prefix = "/images/";
const suffix = ".png";

function updateImage() {
	$("#image").prop("src", prefix + (page - 1) + suffix);
}

async function updatePoem() {
	const poems = await fetch("/poems/poems.json").then((response) => response.json());
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
	let correctNum = getNumOfCorrect();
	$("#correctNum").text(correctNum);
	$("#correctPercentage").text(Math.round(correctNum * 100 / 26));
	$("#correctPercentageConfidence").text(userData.confidence);
}

let numOfCorrect = 0;

function getNumOfCorrect() {
	numOfCorrect = 0;
	for (let i = 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (userData.results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == fakeAnswers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
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
		} else if (userData.results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == fakeAnswers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
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
			} else if (userData.results[localMode][(current < numOfImages ? current : current - numOfImages) - 1].value == fakeAnswers[localMode][(current < numOfImages ? current : current - numOfImages) - 1]) {
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

function setFakeWrongRealCorrect() {
	unsetFakeReal();
	$("#buttonFakeWrap").addClass("wrong");
	$("#buttonRealWrap").addClass("correct");
}

function setFakeCorrect() {
	unsetFakeReal();
	$("#buttonFakeWrap").addClass("correct");
}

function setRealWrongFakeCorrect() {
	unsetFakeReal();
	$("#buttonFakeWrap").addClass("correct");
	$("#buttonRealWrap").addClass("wrong");
}

function setRealCorrect() {
	unsetFakeReal();
	$("#buttonRealWrap").addClass("correct");
}