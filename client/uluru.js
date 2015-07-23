function Uluru(endpoint, requestIdentifier) {
    this.endpoint = endpoint;
    this.requestIdentifier = requestIdentifier || 0;
}

Uluru.prototype.setDomContentLoaded = function (domContentLoaded) {
    this.domContentLoaded = domContentLoaded;
};

Uluru.prototype.setLoadTime = function (loadTime) {
    this.loadTime = loadTime;
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
            resourceStats[currentValue.initiatorType] += currentValue.duration;
        });
        stats.resourceStats = resourceStats;
    }

    stats.url = window.location.href;
    stats.connectionTime = window.performance.timing.connectStart;
    stats.connectionDelta = window.performance.timing.connectEnd - window.performance.timing.connectStart;
    stats.responseDelta = window.performance.timing.responseEnd - window.performance.timing.responseStart;
    stats.firstByte = window.performance.timing.responseStart - window.performance.timing.requestStart;
    stats.domContentLoaded = this.domContentLoaded;
    stats.loadTime = this.loadTime;
    stats.requestIdentifier = this.requestIdentifier;

    if(window.performance.navigation.type != window.performance.navigation.TYPE_BACK_FORWARD) {
        var http = new XMLHttpRequest();
        http.open("POST", this.endpoint, true);
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(stats));
    }
};
