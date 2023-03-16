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
		nextButton.prop("disabled", true);
		checkFinish();
	} else {
		backButton.prop("disabled", false);
		nextButton.prop("disabled", false);
		submitButton.css("display", "none");
	}

	if (images[page].value == "real") {
		setRealSelected();
		setFakeUnselected();
	} else if (images[page].value == "fake") {
		setRealUnselected();
		setFakeSelected();
	} else {
		setRealUnselected();
		setFakeUnselected();
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
	for (let i = 0; i <= pageLimit; i++) {
		if (images[i].value == null) {
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

	saveAnswer();
	if (page == pageLimit) {
		checkFinish();
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

	saveAnswer();
	if (page == pageLimit) {
		checkFinish();
	}
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
		$(`#${i+1}`).removeClass();
		if (page == i) {
			$(`#${i+1}`).addClass("page-current");
		} else if (images[i].value == null) {
			$(`#${i+1}`).addClass("page-unanswered");
		} else {
			$(`#${i+1}`).addClass("page-answered");
		}
	}
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