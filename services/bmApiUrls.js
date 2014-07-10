angular.module("bmComponents").provider("bmApiUrls", function () {

    var that = this;
    var urlMap = {};

    this.setHostname = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        urlMap[id]["hostname"] = value;
    };

    this.setApiVersion = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        urlMap[id]["apiVersion"] = value;
    };

    this.setPort = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        urlMap[id]["port"] = value;
    };

    this.setSecure = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        urlMap[id]["secure"] = value;
    };

    this.setUrlGenerator = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        urlMap[id]["urlGenerator"] = value;
    };

    this.setUrls = function (id, value) {
        if (!urlMap[id]) {
            urlMap[id] = {};
        }
        if (!urlMap[id]["urls"]) {
            urlMap[id]["urls"] = {};
        }
        angular.extend(urlMap[id].urls, value);
    };

    this.$get = function () {
        return {
            setUrls: that.setUrls,
            setApiVersion: that.setApiVersion,
            setPort: that.setPort,
            setSecure: that.setSecure,
            setHostname: that.setHostname,
            setUrlGenerator: that.setUrlGenerator,
            getUrl: function (id, key) {

                var url = urlMap[id].urls[key],
                    argsArray;

                if (angular.isFunction(url)) {
                    argsArray = Array.prototype.slice.call(arguments);
                    argsArray.splice(0, 2);
                    url = url.apply(null, argsArray);
                }

                if (angular.isFunction(urlMap[id].urlGenerator)) {
                    return (urlMap[id].hostname ? urlMap[id].secure ? "https://" : "http://" : "") +
                        urlMap[id].urlGenerator(urlMap[id].hostname, urlMap[id].port, urlMap[id].apiVersion) +
                        url;
                } else {
                    return (urlMap[id].hostname ? urlMap[id].secure ? "https://" : "http://" : "") +
                        (urlMap[id].hostname ? urlMap[id].hostname : "") +
                        (urlMap[id].port ? ":" + urlMap[id].port : "") +
                        (urlMap[id].apiVersion ? "/v" + urlMap[id].apiVersion : "") +
                        url;
                }
            }
        }
    }
});