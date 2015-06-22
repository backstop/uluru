 window.onload = function(){
	var uluru = "http://localhost:9999/beacon/"

	var url = window.location.href;	

	var connectionDelta = window.performance.timing.connectEnd - window.performance.timing.connectStart;

	var responseDelta = window.performance.timing.responseEnd - window.performance.timing.responseStart;

	var firstByte = window.performance.timing.responseStart - window.performance.timing.requestStart;

	var loadTime = new Date().getTime()  - window.performance.timing.navigationStart;

	var statsMap = {};

	statsMap["url"] = url;
	statsMap["connectionTime"] = window.performance.timing.connectStart;
	statsMap["connectionDelta"] = connectionDelta;
	statsMap["responseDelta"] = responseDelta;
	statsMap["firstByte"] = firstByte;
	statsMap["loadTime"] = loadTime;

	var statsJson = JSON.stringify(statsMap);

	var http = new XMLHttpRequest();
	http.open("POST", uluru, true);
	http.setRequestHeader("Content-type", "application/json");
	http.send(statsJson);

	console.log("Url : " + statsMap["url"]);
	console.log("Connection time: " + statsMap["connectionTime"])
	console.log("Connection: " + statsMap["connectionDelta"]);
	console.log("Response: " + statsMap["responseDelta"]);
	console.log("First byte: " + statsMap["firstByte"]);
	console.log("Load time: " + statsMap["loadTime"]);

};

