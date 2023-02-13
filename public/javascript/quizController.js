const images = {
	"0": { value: null },
	"1": { value: null },
	"2": { value: null },
	"3": { value: null },
	"4": { value: null },
	"5": { value: null },
	"6": { value: null },
	"7": { value: null },
	"8": { value: null },
	"9": { value: null },
	"10": { value: null },
	"11": { value: null },
	"12": { value: null },
	"13": { value: null },
	"14": { value: null },
	"15": { value: null },
	"16": { value: null },
	"17": { value: null },
	"18": { value: null },
	"19": { value: null },
};

let page = 0;
const pageLimit = Object.keys(images).length - 1;

window.onload = function() {
	check();
};


const realButton = document.getElementById("realButton");
const fakeButton = document.getElementById("fakeButton");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");

function check() {
	if (page < 0) {
		page = 0;
		check();
	} else if (page > pageLimit) {
		page = pageLimit;
		check();
	}

	if (images[page].value == "real") {
		realButton.checked = true;
		fakeButton.checked = false;
	} else if (images[page].value == "fake") {
		realButton.checked = false;
		fakeButton.checked = true;
	} else {
		realButton.checked = false;
		fakeButton.checked = false;
	}

	document.getElementById("page").innerHTML = page + 1;
	document.getElementById("pageLimit").innerHTML = pageLimit + 1;

	updateAnswerTracker();
}


function backClick() {
	if (page - 1 < 0) { return; } // USELESS LINE (INCASE SOMEONE RUN backClick() from console)
	saveAnswer();
	page--;
	check();
}

function nextClick() {
	if (page + 1 > pageLimit) { return; } // USELESS LINE (INCASE SOMEONE RUN nextClick() from console)
	saveAnswer();
	page++;
	check();
}

function toggleFake() {
	if (fakeButton.checked) {
		fakeButton.checked = false;
	} else {
		if (realButton.checked) {
			realButton.checked = false;
		}

		fakeButton.checked = true;
	}
}

function toggleReal() {
	if (realButton.checked) {
		realButton.checked = false;
	} else {
		if (fakeButton.checked) {
			fakeButton.checked = false;
		}

		realButton.checked = true;
	}
}

function saveAnswer() {
	if (realButton.checked) {
		images[page].value = "real";
	} else if (fakeButton.checked) {
		images[page].value = "fake";
	} else {
		images[page].value = null;
	}
}

function updateAnswerTracker() {
	let bar = null;
	for (let i = 0; i <= pageLimit; i++) {
		let temp;
		if (i == page) {
			temp = "current";
		} else {
			temp = (images[i].value == null ? "unanswered" : images[i].value);
		}

		bar = (bar == null ? "" : bar + " - ") + temp;
	}

	document.getElementById("answerTracker").innerHTML = bar;
}