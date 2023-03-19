// I am ashamed of this code

const data = {
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
	response: null,
	id: null,
};

const idLength = 20;

let page = 0;
const pageLimit = idLength;

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

	if(page != 20) {
		if (data[page].value == "real") {
			setRealSelected();
			setFakeUnselected();
		} else if (data[page].value == "fake") {
			setRealUnselected();
			setFakeSelected();
		} else {
			setRealUnselected();
			setFakeUnselected();
		}
	}

	updateAnswerTracker();

	if (page != 20) {
		updateImage();
	} else {
		showInput();
	}
}

function showInput() {
	imageElement.css("display", "none");
	$("#buttons").css("display", "none");
	$("#inputdiv").css("display", "inline");
}

let allAnswered = true;

function backClick() {
	if (page - 1 < 0) { return; } // USELESS LINE (INCASE SOMEONE RUN backClick() from console)
	if (page != 20) { saveAnswer(); }
	page--;
	check();
}

function nextClick() {
	if (page + 1 > pageLimit) { return; } // USELESS LINE (INCASE SOMEONE RUN nextClick() from console)
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
		if (data[i].value == null) {
			allAnswered = false;
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


const prefix = "/images/";
const suffix = ".png";

function updateImage() {
	$("#buttons").css("display", "block");
	$("#inputdiv").css("display", "none");
	imageElement.css("display", "inline");
	imageElement.prop("src", prefix + page + suffix);
}

function saveAnswer() {
	allAnswered = true;
	if (realButton.prop("checked")) {
		data[page].value = "real";
	} else if (fakeButton.prop("checked")) {
		data[page].value = "fake";
	} else {
		data[page].value = null;
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
		} else if (data[i].value == null) {
			$(`#${i+1}`).addClass("page-unanswered");
		} else {
			$(`#${i+1}`).addClass("page-answered");
		}
	}
}

function submit(e) {
	/* stop form from submitting normally */
	e.preventDefault();

	const datas = data;
	data.id = (window.location.href).slice((window.location.href).length - idLength - 1);
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
		window.location.href = `/quiz/thanks?form=${(window.location.href).slice((window.location.href).length - idLength - 1)}`;
	});
}