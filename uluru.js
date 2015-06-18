 window.onload = function(){
	console.log(window.performance.timing);

	var connectionDelta = window.performance.timing.connectEnd - window.performance.timing.connectStart;

	var responseDelta = window.performance.timing.responseEnd - window.performance.timing.responseStart;

	var firstbyteDelta = window.performance.timing.responseStart - window.performance.timing.requestStart;

	console.log("Connection: " + connectionDelta);
	console.log("Response: " + responseDelta);
	console.log("First byte: " + firstbyteDelta);


};

