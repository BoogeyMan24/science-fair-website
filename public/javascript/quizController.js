// I am ashamed of this code

const data = {
	"images": {
		"0": { value: null, timeSpent: 0 },
		"1": { value: null, timeSpent: 0 },
		"2": { value: null, timeSpent: 0 },
		"3": { value: null, timeSpent: 0 },
		"4": { value: null, timeSpent: 0 },
		"5": { value: null, timeSpent: 0 },
		"6": { value: null, timeSpent: 0 },
		"7": { value: null, timeSpent: 0 },
		"8": { value: null, timeSpent: 0 },
		"9": { value: null, timeSpent: 0 },
		"10": { value: null, timeSpent: 0 },
		"11": { value: null, timeSpent: 0 },
		"12": { value: null, timeSpent: 0 },
		"13": { value: null, timeSpent: 0 },
		"14": { value: null, timeSpent: 0 },
		"15": { value: null, timeSpent: 0 },
		"16": { value: null, timeSpent: 0 },
		"17": { value: null, timeSpent: 0 },
		"18": { value: null, timeSpent: 0 },
		"19": { value: null, timeSpent: 0 },
	},
	"poems": {
		"0": { value: null, timeSpent: 0 },
		"1": { value: null, timeSpent: 0 },
		"2": { value: null, timeSpent: 0 },
		"3": { value: null, timeSpent: 0 },
		"4": { value: null, timeSpent: 0 },
		"5": { value: null, timeSpent: 0 },
	},
	response: null,
	id: null,
};

const imageLength = 20;
const poemLength = 6;
const idLength = imageLength + poemLength;

const idLengths = 20;

let page = 0;
const pageLimit = idLength;

let realButton;
let fakeButton;
let backButton;
let nextButton;
let submitButton;
let imageElement;

let date = 0;
let endDate = 0;

$(window).load(function() {
	realButton = $("#realButton");
	fakeButton = $("#fakeButton");
	backButton = $("#backButton");
	nextButton = $("#nextButton");
	submitButton = $("#submitButton");
	imageElement = $("#image");
	check();
});

$("#input").on("input change keyup", function() {
	data["response"] = (this.value == "" ? null : this.value);
	allAnswered = true;
	checkFinish();
});


function check() {
	if (page < 0) {
		page = 0;
		check();
	} else if (page > pageLimit) {
		page = pageLimit;
		check();
	}
	date = new Date();

	if (page == 0) {
		backButton.prop("disabled", true);
	} else if (page == pageLimit) {
		nextButton.prop("disabled", true);
		checkFinish();
	} else {
		backButton.prop("disabled", false);
		nextButton.prop("disabled", false);
		submitButton.css("display", "none");
	}

	if (page != idLength) {
		if (data["images"][page]?.value == "real" || data["poems"][page - imageLength]?.value == "real") {
			setRealSelected();
			setFakeUnselected();
		} else if (data["images"][page]?.value == "fake" || data["poems"][page - imageLength]?.value == "fake") {
			setRealUnselected();
			setFakeSelected();
		} else {
			setRealUnselected();
			setFakeUnselected();
		}
	}

	updateAnswerTracker();

	if (page != idLength) {
		if (page < imageLength) {
			updateImage();
		} else {
			updatePoem();
		}
	} else {
		showInput();
	}
}

function showInput() {
	imageElement.css("display", "none");
	$("#poem").css("display", "none");
	$("#longerLoad").css("display", "none");
	$("#buttons").css("display", "none");
	$("#inputdiv").css("display", "inline");
	$("#input").html((data["response"] == null ? "" : data["response"]));
}

const prefix = "/images/";
const suffix = ".png";

function updateImage() {
	$("#longerLoad").css("display", "block");
	$("#buttons").css("display", "block");
	$("#inputdiv").css("display", "none");
	$("#poem").css("display", "none")
	imageElement.css("display", "inline");
	imageElement.prop("src", prefix + page + suffix);
}

async function updatePoem() {
	const poems = await fetch("/poems/poems.json").then((response) => response.json());

	$("#longerLoad").css("display", "none");
	$("#inputdiv").css("display", "none");
	imageElement.css("display", "none");
	$("#buttons").css("display", "block");
	$("#poem").css("display", "inline");
	$("#poem").html("<span style=\"font-size: 2.4vh\"> " + poems[page - imageLength].name + "</span> <br><br> <span style=\"font-size: 1.8vh\"> " + poems[page - imageLength].poem + "</span>");
}


let allAnswered = true;

function backClick() {
	if (page - 1 < 0) { return; } // USELESS LINE (INCASE SOMEONE RUN backClick() from console)
	endDate = new Date();
	if (page != idLength) { saveAnswer(); }
	page--;
	check();
}

function nextClick() {
	if (page + 1 > pageLimit) { return; } // USELESS LINE (INCASE SOMEONE RUN nextClick() from console)
	endDate = new Date();
	saveAnswer();
	page++;
	check();
}

function setFakeSelected() {
	fakeButton.prop("checked", true);
	$("#buttonFakeWrap").addClass("selected");
}

function setFakeUnselected() {
	fakeButton.prop("checked", false);
	$("#buttonFakeWrap").removeClass("selected");
}

function setRealSelected() {
	realButton.prop("checked", true);
	$("#buttonRealWrap").addClass("selected");
}

function setRealUnselected() {
	realButton.prop("checked", false);
	$("#buttonRealWrap").removeClass("selected");
}

function checkFinish() {
	for (let i = 0; i < idLength; i++) {
		if (data["response"] == null || data["response"] == "") {
			allAnswered = false;
			break;
		}
		if (i < imageLength) {
			if (data["images"][i].value == null) {
				allAnswered = false;
			}
		} else if (i >= imageLength && i < idLength) {
			if (data["poems"][i - imageLength].value == null) {
				allAnswered = false;
			}
		}
	}
	submitButton.css("display", "inline");
	if (allAnswered) {
		submitButton.prop("disabled", false);
		submitButton.text("Confirm & Submit");
	} else {
		submitButton.prop("disabled", true);
		submitButton.text("Not Everything Answered");
	}
}

function toggleFake() {
	if (fakeButton.prop("checked")) {
		setFakeUnselected();
	} else {
		if (realButton.prop("checked")) {
			setRealUnselected();
		}
		setFakeSelected();
	}

	if (page == pageLimit) {
		checkFinish();
	} else {
		saveAnswer();
	}
}

function toggleReal() {
	if (realButton.prop("checked")) {
		setRealUnselected();
	} else {
		if (fakeButton.prop("checked")) {
			setFakeUnselected();
		}

		setRealSelected();
	}

	if (page == pageLimit) {
		checkFinish();
	} else {
		saveAnswer();
	}
}

function saveAnswer() {
	allAnswered = true;
	if (page < imageLength) {
		if (realButton.prop("checked")) {
			data["images"][page].value = "real";
		} else if (fakeButton.prop("checked")) {
			data["images"][page].value = "fake";
		} else {
			data["images"][page].value = null;
		}
		data["images"][page].timeSpent += endDate - date;
	} else if (page >= imageLength && page < idLength) {
		if (realButton.prop("checked")) {
			data["poems"][page - imageLength].value = "real";
		} else if (fakeButton.prop("checked")) {
			data["poems"][page - imageLength].value = "fake";
		} else {
			data["poems"][page - imageLength].value = null;
		}
		data["poems"][page - imageLength].timeSpent += endDate - date;
	}
}

function updateAnswerTracker() {
	let bar = null;
	for (let i = 0; i <= idLength; i++) {
		$(`#${i+1}`).removeClass();
		if (page == i) {
			$(`#${i+1}`).addClass("page-current");
		} else if (i == idLength) {
			if (data["response"] == null || data["response"] == "") {
				$(`#${i+1}`).addClass("page-unanswered");
			} else {
				$(`#${i+1}`).addClass("page-answered");
			}
		} else if (i < imageLength) {
			if (data["images"][i].value == null) {
				$(`#${i+1}`).addClass("page-unanswered");
			} else {
				$(`#${i+1}`).addClass("page-answered");
			}
		} else if (i >= imageLength && i < idLength) {
			if (data["poems"][i - imageLength].value == null) {
				$(`#${i+1}`).addClass("page-unanswered");
			} else {
				$(`#${i+1}`).addClass("page-answered");
			}
		}
	}
}

function submit(e) {
	/* stop form from submitting normally */
	e.preventDefault();

	const datas = data;
	data.id = (window.location.href).slice((window.location.href).length - idLengths - 1);
	$.ajax({
		url: `/quiz/submit`,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(datas),
		success: function(data) {
			console.log("success returned in ajax");
		},
		error: function(xhr, status, error) {
			console.log("failure");
			window.location.replace("/");
		},
	}).done(() => {
		window.location.replace(`/quiz/thanks?form=${(window.location.href).slice((window.location.href).length - idLengths - 1)}`);
	});
}