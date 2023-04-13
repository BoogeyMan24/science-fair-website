const numOfImages = 20;
const numOfPoems = 6;
const numOfPages = numOfImages + numOfPoems;


$(window).load(function() {
	// let xyValues = getTimeVSAccuracyDataPoems();
	let xyConfidenceAccuracy = getConfideceVSAccuracyData();
	let xyConfidenceAccuracyImages = getConfideceVSAccuracyDataImages();
	let xyConfidenceAccuracyPoems = getConfideceVSAccuracyDataPoems();

	let xyTimeAccuracy = getTimeVSAccuracyData();
	let xyTimeAccuracyImages = getTimeVSAccuracyDataImages();
	let xyTimeAccuracyPoems = getTimeVSAccuracyDataPoems();

	let yValues = getAccuracyAvgForEachPage();



	const backgroundColor = [];
	for (let i = 0; i < numOfPages; i++) {
		const localMode = i < numOfImages ? "images" : "poems";
		if (i == numOfImages) {
			backgroundColor.push("rgb(0,0,0)");
		}
		backgroundColor.push((answers[localMode][(i < numOfImages ? i : i - numOfImages)] == "real" ? "rgba(30, 126, 235, 0.6)" : "rgba(235, 64, 52, 0.6)"));

		if (i == numOfPages - 1) {
			backgroundColor.push("rgb(0,0,0)");
			backgroundColor.push("rgb(8, 191, 72, 0.6)");
			backgroundColor.push("rgb(8, 191, 72, 0.6)");
			backgroundColor.push("rgb(8, 191, 72, 0.6)");
		}
	}

	const borderColor = [];
	for (let i = 0; i < numOfPages; i++) {
		const localMode = i < numOfImages ? "images" : "poems";
		if (i == numOfImages) {
			borderColor.push("rgb(0,0,0)");
		}
		borderColor.push(((answers[localMode][(i < numOfImages ? i : i - numOfImages)]) == "real" ? "rgba(30, 126, 235, 0.8)" : "rgba(235, 64, 52, 0.8)"));

		if (i == numOfPages - 1) {
			borderColor.push("rgb(0,0,0)");
			borderColor.push("rgb(8, 191, 72, 0.8)");
			borderColor.push("rgb(8, 191, 72, 0.8)");
			borderColor.push("rgb(8, 191, 72, 0.8)");
		}
	}



	new Chart("confidenceaccuracy", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyConfidenceAccuracy,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Accuracy (Percentage %)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Confidence (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("confidenceaccuracyimages", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyConfidenceAccuracyImages,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Image Accuracy (Percentage %)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Confidence (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("confidenceaccuracypoems", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyConfidenceAccuracyPoems,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Poem Accuracy (Percentage %)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Confidence (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("timeaccuracy", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyTimeAccuracy,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 35 }, scaleLabel: { display: true, labelString: "Average Time Spent (s)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Accuracy (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("timeaccuracyimages", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyTimeAccuracyImages,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 35 }, scaleLabel: { display: true, labelString: "Average Time Spent (s)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Image Accuracy (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("timeaccuracypoems", {
		type: "scatter",
		data: {
			datasets: [{
				pointRadius: 4,
				pointBackgroundColor: "rgb(0,0,255)",
				data: xyTimeAccuracyPoems,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				xAxes: [{ ticks: { min: 0, max: 35 }, scaleLabel: { display: true, labelString: "Average Time Spent (s)" } }],
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Poem Accuracy (Percentage %)" } }],
			},
			showLines: false,
		},
	});

	new Chart("baraccuracy", {
		type: "bar",
		data: {
			labels: ["photo 1", "painting 2", "animal 3", "photo  4", "pencil 5", "painting 6", "animal 7", "photo 8", "photo 9", "painting 10", "painting 11", "photo 12", "paiting 13", "photo 14", "painting 15", "paiting 16", "paiting 17", "paiting 18", "photo 19", "photo 20", "", "poem 1", "poem 2", "poem 3", "poem 4", "poem 5", "poem 6", "", "average", "images average", "poems average"],
			datasets: [{
				backgroundColor: backgroundColor,
				borderColor: borderColor,
				borderWidth: 1.5,
				data: yValues,
			}],
		},
		options: {
			legend: { display: false },
			scales: {
				yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Accruacy (Percentage %)" } }],
			},
		},
	});
});

function getAccuracyAvgForEachPage() {
	const yValues = [];
	for (let i = 0; i < numOfPages; i++) {
		if (i == numOfImages) {
			yValues.push(0);
		}
		const y = (getNumOfCorrectForPageFromAll(i) / allData.length * 100).toFixed(2);
		yValues.push(y);
	}

	let total = 0;
	let imageTotal = 0;
	let poemTotal = 0;

	for (let i = 0; i < yValues.length; i++) {
		total += parseFloat(yValues[i]);

		if (i < numOfImages) {
			imageTotal += parseFloat(yValues[i]);
		} else if (i > numOfImages) {
			poemTotal += parseFloat(yValues[i]);
		}
	}

	yValues.push(0);

	yValues.push((total / numOfPages).toFixed(2));
	yValues.push((imageTotal / numOfImages).toFixed(2));
	yValues.push((poemTotal / numOfPoems).toFixed(2));

	return yValues;
}

function getNumOfCorrectForPageFromAll(page) {
	let numOfCorrect = 0;
	for (let i = 0; i < allData.length; i++) {
		const localMode = page < numOfImages ? "images" : "poems";
		if (allData[i].results[localMode][(page < numOfImages ? page : page - numOfImages)].value == answers[localMode][(page < numOfImages ? page : page - numOfImages)]) {
			numOfCorrect++;
		}
	}

	return numOfCorrect;
}

function getTimeVSAccuracyData() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: getAvgTimeSpent(i).toFixed(2), y: (getNumOfCorrect(i) / numOfPages * 100).toFixed(2) };
		xyValues.push(point);
	}

	return xyValues;
}

function getTimeVSAccuracyDataImages() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: getAvgTimeSpent(i).toFixed(2), y: (getNumOfCorrectImages(i) / numOfImages * 100).toFixed(2) };
		xyValues.push(point);
	}

	return xyValues;
}

function getTimeVSAccuracyDataPoems() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: getAvgTimeSpent(i).toFixed(2), y: (getNumOfCorrectPoems(i) / numOfPoems * 100).toFixed(2) };
		xyValues.push(point);
	}

	return xyValues;
}


function getConfideceVSAccuracyData() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: (getNumOfCorrect(i) / numOfPages * 100).toFixed(2), y: allData[i].confidence };
		xyValues.push(point);
	}

	return xyValues;
}

function getConfideceVSAccuracyDataImages() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: (getNumOfCorrectImages(i) / numOfImages * 100).toFixed(2), y: allData[i].confidence };
		xyValues.push(point);
	}

	return xyValues;
}

function getConfideceVSAccuracyDataPoems() {
	const xyValues = [];
	for (let i = 0; i < allData.length; i++) {
		const point = { x: (getNumOfCorrectPoems(i) / numOfPoems * 100).toFixed(2), y: allData[i].confidence };
		xyValues.push(point);
	}

	return xyValues;
}


function getAvgTimeSpent(userIndex) {
	let timeSpentTotal = 0;
	for (let i = 2; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		timeSpentTotal += allData[userIndex].results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].timeSpent;
	}
	return (timeSpentTotal / numOfPages / 1000);
}

function getNumOfCorrect(userIndex) {
	let numOfCorrect = 0;
	for (let i = 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (allData[userIndex].results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == answers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
			numOfCorrect++;
		}
	}
	return numOfCorrect;
}

function getNumOfCorrectImages(userIndex) {
	let numOfCorrect = 0;
	for (let i = 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (localMode == "poems") {
			break;
		}
		if (allData[userIndex].results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == answers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
			numOfCorrect++;
		}
	}
	return numOfCorrect;
}

function getNumOfCorrectPoems(userIndex) {
	let numOfCorrect = 0;
	for (let i = numOfImages + 1; i <= numOfPages; i++) {
		const localMode = i <= numOfImages ? "images" : "poems";
		if (allData[userIndex].results[localMode][(i <= numOfImages ? i : i - numOfImages) - 1].value == answers[localMode][(i <= numOfImages ? i : i - numOfImages) - 1]) {
			numOfCorrect++;
		}
	}
	return numOfCorrect;
}