const data = {
	"images": {
		"0": { value: null },
		"1": { value: null },
		"2": { value: null },
		"3": { value: null },
		"4": { value: null },
	},
	"poems": {
		"0": { value: null },
		"1": { value: null },
		"2": { value: null },
	},
};

const numOfImages = 5;
const numOfPoems = 3;
const numOfPages = numOfImages + numOfPoems;

let page = 1;
let mode = "images";

$(window).load(function() {
	page = 1;
	mode = "images";
	updatePage();
});

let allAnswered = false;

function updatePage() {
	// allAnswered = false;
	if (page < 1) {
		page = 1;
	} else if (page > numOfPages) {
		page = numOfPages;
	}

	if (page == 1) {
		$("#backButton").prop("disabled", true);

		$("#finishbutton").prop("disabled", true);
		$("#finishbutton").css("display", "none");
	} else if (page == numOfPages) {
		$("#nextButton").prop("disabled", true);

		checkFinishDisabled();
		$("#finishbutton").css("display", "inline");
	} else {
		$("#backButton").prop("disabled", false);
		$("#nextButton").prop("disabled", false);

		$("#finishbutton").prop("disabled", true);
		$("#finishbutton").css("display", "none");
	}

	switchQuestion();

	if (page <= numOfImages && mode == "images") {
		updateImage();
	} else {
		updatePoem();
	}

	if (data[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "real") {
		setRealSelected();
		setFakeUnselected();
	} else if (data[mode][(mode == "images" ? page : page - numOfImages) - 1].value == "fake") {
		setRealUnselected();
		setFakeSelected();
	} else {
		setRealUnselected();
		setFakeUnselected();
	}

	updateAnswerTracker();
}

function nextPage() {
	saveAnswer();
	page++;
	updatePage();
}

function prevPage() {
	saveAnswer();
	page--;
	updatePage();
}

function toggleFake() {
	if ($("#fakeButton").prop("checked")) {
		setFakeUnselected();
	} else {
		if ($("#realButton").prop("checked")) {
			setRealUnselected();
		}
		setFakeSelected();
	}

	if (page == numOfPages) {
		saveAnswer();
		checkFinishDisabled();
	}
}

function toggleReal() {
	if ($("#realButton").prop("checked")) {
		setRealUnselected();
	} else {
		if ($("#fakeButton").prop("checked")) {
			setFakeUnselected();
		}

		setRealSelected();
	}

	if (page == numOfPages) {
		saveAnswer();
		checkFinishDisabled();
	}
}

function setFakeSelected() {
	$("#fakeButton").prop("checked", true);
	$("#buttonFakeWrap").addClass("selected");
}

function setFakeUnselected() {
	$("#fakeButton").prop("checked", false);
	$("#buttonFakeWrap").removeClass("selected");
}

function setRealSelected() {
	$("#realButton").prop("checked", true);
	$("#buttonRealWrap").addClass("selected");
}

function setRealUnselected() {
	$("#realButton").prop("checked", false);
	$("#buttonRealWrap").removeClass("selected");
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
		$("#longerLoad").css("display", "block");
	} else if (page > numOfImages) {
		mode = "poems";
		$("#poem").css("display", "block");
		$("#image").css("display", "none");
		$("#longerLoad").css("display", "none");
	}
}

function saveAnswer() {
	if ($("#fakeButton").prop("checked")) {
		data[mode][(mode == "images" ? page : page - numOfImages) - 1].value = "fake";
	} else if ($("#realButton").prop("checked")) {
		data[mode][(mode == "images" ? page : page - numOfImages) - 1].value = "real";
	} else {
		data[mode][(mode == "images" ? page : page - numOfImages) - 1].value = null;
	}
}

function updateAnswerTracker() {
	for (let i = 0; i < numOfPages; i++) {
		$(`#${i+1}`).removeClass();
		const localMode = i < numOfImages ? "images" : "poems";
		if (i+1 == page) {
			$(`#${i+1}`).addClass("page-current");
		} else if (data[localMode][(localMode == "images" ? i : i - numOfImages)].value != null) {
			$(`#${i+1}`).addClass("page-answered");
		} else {
			$(`#${i+1}`).addClass("page-unanswered");
		}
	}
}


function checkFinishDisabled() {
	allAnswered = true;

	for (let i = 0; i < numOfPages; i++) {
		const localMode = i < numOfImages ? "images" : "poems";
		if (data[localMode][(localMode == "images" ? i : i - numOfImages)].value != "real" && data[localMode][(localMode == "images" ? i : i - numOfImages)].value != "fake") {
			allAnswered = false;
		}
	}

	if (allAnswered) {
		$("#finishbutton").text("Finish");
		$("#finishbutton").prop("disabled", false);
	} else {
		$("#finishbutton").text("Not All Answered");
		$("#finishbutton").prop("disabled", true);
	}
}


function submit(e) {
	/* stop form from submitting normally */
	e.preventDefault();

	const id = generateId();

	const datas = data;
	data.id = id;
	$.ajax({
		url: "/demo/submit",
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(datas),
		success: function(data) {
			console.log("success returned in ajax");
		},
		error: function(xhr, status, error) {
			console.log("failure");
		},
	}).done(() => {
		console.log("test");
		window.location.replace(`/demo/results/${id}`);
	});
}


function generateId() {
	let number = "";
	for (let i = 0; i < 20; i++) {
		number = number + Math.floor(Math.random() * 10).toString();
	}
	return number;
}