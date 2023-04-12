const numOfImages = 20;
const numOfPoems = 6;
const numOfPages = numOfImages + numOfPoems;


$(window).load(function() {
	// let xyValues = getTimeVSAccuracyDataPoems();
	let yValues = getAccuracyAvgForEachPage();

	const backgroundColor = [];
	for (let i = 0; i < numOfPages; i++) {
		const localMode = i < numOfImages ? "images" : "poems";
		if (i == numOfImages) {
			backgroundColor.push("rgb(0,0,0)");
		}
		backgroundColor.push((answers[localMode][(i < numOfImages ? i : i - numOfImages)] == "real" ? "rgba(30, 126, 235, 0.6)" : "rgba(235, 64, 52, 0.6)"));
	}

	const borderColor = [];
	for (let i = 0; i < numOfPages; i++) {
		const localMode = i < numOfImages ? "images" : "poems";
		if (i == numOfImages) {
			borderColor.push("rgb(0,0,0)");
		}
		borderColor.push(((answers[localMode][(i < numOfImages ? i : i - numOfImages)]) == "real" ? "rgba(30, 126, 235, 0.8)" : "rgba(235, 64, 52, 0.8)"));
	}

	new Chart("myChart", {
		type: "bar",
		data: {
			labels: ["photo 1", "painting 2", "animal 3", "photo  4", "pencil 5", "painting 6", "animal 7", "photo 8", "photo 9", "painting 10", "painting 11", "photo 12", "paiting 13", "photo 14", "painting 15", "paiting 16", "paiting 17", "paiting 18", "photo 19", "photo 20", "", "poem 1", "poem 2", "poem 3", "poem 4", "poem 5", "poem 6"],
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


	// new Chart("myChart", {
	// 	type: "scatter",
	// 	data: {
	// 		datasets: [{
	// 			pointRadius: 4,
	// 			pointBackgroundColor: "rgb(0,0,255)",
	// 			data: xyValues,
	// 		}],
	// 	},
	// 	options: {
	// 		legend: { display: false },
	// 		scales: {
	// 			xAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Accuracy (Percentage %)" } }],
	// 			yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Confidence (Percentage %)" } }],
	// 		},
	// 	},
	// });

	// new Chart("myChart", {
	// 	type: "scatter",
	// 	data: {
	// 		datasets: [{
	// 			pointRadius: 4,
	// 			pointBackgroundColor: "rgb(0,0,255)",
	// 			data: xyValues,
	// 		}],
	// 	},
	// 	options: {
	// 		legend: { display: false },
	// 		scales: {
	// 			xAxes: [{ ticks: { min: 0, max: 35 }, scaleLabel: { display: true, labelString: "Average Time Spent (s)" } }],
	// 			yAxes: [{ ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: "Accuracy (Percentage %)" } }],
	// 		},
	// 	},
	// });
});

function getAccuracyAvgForEachPage() {
	const yValues = [];
	for (let i = 0; i < numOfPages; i++) {
		if (i == numOfImages) {
			yValues.push("");
		}
		const y = (getNumOfCorrectForPageFromAll(i) / allData.length * 100).toFixed(2);
		yValues.push(y);
	}

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