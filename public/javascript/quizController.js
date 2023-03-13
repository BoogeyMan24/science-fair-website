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
	id: null,
};

const idLength = 20;

let page = 0;
const pageLimit = idLength - 1;

let realButton;
let fakeButton;
let backButton;
let nextButton;
let submitButton;
let imageElement;


$(window).load(function() {
	realButton = $("#realButton");
	fakeButton = $("#fakeButton");
	backButton = $("#backButton");
	nextButton = $("#nextButton");
	submitButton = $("#submitButton");
	imageElement = $("#image");
	check();
});



function check() {
	if (page < 0) {
		page = 0;
		check();
	} else if (page > pageLimit) {
		page = pageLimit;
		check();
	}

	if (page == 0) {
		backButton.prop("disabled", true);
	} else if (page == pageLimit) {
		nextButton.text("Finish");
	} else {
		backButton.prop("disabled", false);
		nextButton.text("Next");
		submitButton.css("display", "none");
	}

	if (images[page].value == "real") {
		realButton.prop("checked", true);
		fakeButton.prop("checked", false);
	} else if (images[page].value == "fake") {
		realButton.prop("checked", false);
		fakeButton.prop("checked", true);
	} else {
		realButton.prop("checked", false);
		fakeButton.prop("checked", false);
	}

	$("#page").text(page + 1);
	$("#pageLimit").text(pageLimit + 1);

	updateImage();

	updateAnswerTracker();
}

let allAnswered = true;

function backClick() {
	if (page - 1 < 0) { return; } // USELESS LINE (INCASE SOMEONE RUN backClick() from console)
	saveAnswer();
	page--;
	check();
}

function nextClick() {
	if (nextButton.text() == "Finish") {
		saveAnswer();
		for (let i = 0; i <= pageLimit; i++) {
			if (images[i].value == null) {
				allAnswered = false;
			}
		}
		if (allAnswered) {
			submitButton.css("display", "block");
			submitButton.prop("disabled", false);
			submitButton.text("Confirm & Submit");
		} else {
			submitButton.css("display", "block");
			submitButton.prop("disabled", true);
			submitButton.text("Not Everything Answered");
		}

		return;
	}
	if (page + 1 > pageLimit) { return; } // USELESS LINE (INCASE SOMEONE RUN nextClick() from console)
	saveAnswer();
	page++;
	check();
}

function toggleFake() {
	if (fakeButton.prop("checked")) {
		fakeButton.prop("checked", false);
	} else {
		if (realButton.prop("checked")) {
			realButton.prop("checked", false);
		}

		fakeButton.prop("checked", true);
	}

	submitButton.css("display", "none");
}

function toggleReal() {
	if (realButton.prop("checked")) {
		realButton.prop("checked", false);
	} else {
		if (fakeButton.prop("checked")) {
			fakeButton.prop("checked", false);
		}

		realButton.prop("checked", true);
	}

	submitButton.css("display", "none");
}


const prefix = "/images/";
const suffix = ".png";

function updateImage() {
	imageElement.prop("src", prefix + page + suffix);
}

function saveAnswer() {
	allAnswered = true;
	if (realButton.prop("checked")) {
		images[page].value = "real";
	} else if (fakeButton.prop("checked")) {
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

	$("#answerTracker").text(bar);
}

function submit(e) {
	/* stop form from submitting normally */
	e.preventDefault();

	const data = images;
	data.id = (window.location.href).slice((window.location.href).length - idLength - 1);
	$.ajax({
		url: `/quiz/submit`,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(data) {
			console.log("success returned in ajax");
		},
		error: function(xhr, status, error) {
			console.log("failure");
		},
	}).done(() => {
		window.location.href = `/quiz/thanks?form=${(window.location.href).slice((window.location.href).length - idLength - 1)}`;
	});
}