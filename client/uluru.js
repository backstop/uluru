function Uluru(endpoint, requestNumber) {
    this.endpoint = endpoint;
    this.requestNumber = requestNumber;
}

Uluru.prototype.setDomContentLoaded = function (domContentLoaded) {
    this.domContentLoaded = Math.round(domContentLoaded);
};

Uluru.prototype.setLoadTime = function (loadTime) {
    this.loadTime = Math.round(loadTime);
};

Uluru.prototype.sendStats = function () {
    var stats = {};

    //This block collects data about resources (stylesheets, scripts, images, etc) downloaded as part of this request.
    var resources = [];
    var resourceStats = {};
    if(!!window.performance.getEntries){
        resources = window.performance.getEntries();
        stats.resourceCount = resources.length;
        resources.forEach(function(currentValue, index, array){
            if (!resourceStats[currentValue.initiatorType]){
                resourceStats[currentValue.initiatorType] = 0;
            }
            resourceStats[currentValue.initiatorType] += Math.round(currentValue.duration);
        });
        stats.resourceStats = resourceStats;
    }

    stats.url = window.location.href;
    stats.connectionTime = window.performance.timing.connectStart;
    stats.connectionDelta = Math.round(window.performance.timing.connectEnd - window.performance.timing.connectStart);
    stats.responseDelta = Math.round(window.performance.timing.responseEnd - window.performance.timing.responseStart);
    stats.firstByte = Math.round(window.performance.timing.responseStart - window.performance.timing.requestStart);
    stats.domContentLoaded = this.domContentLoaded;
    stats.loadTime = this.loadTime;
    stats.requestNumber = this.requestNumber;

    if(window.performance.navigation.type != window.performance.navigation.TYPE_BACK_FORWARD) {
        var http = new XMLHttpRequest();
        http.open("POST", this.endpoint, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(stats));
    }
};
