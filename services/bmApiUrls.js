angular.module("bmComponents").provider("bmApiUrls", function () {

    var that = this;

    this.hostname = "";
    this.apiVersion = "";
    this.port = "";
    this.secure = false;
    this.urls = {};
    this.urlGenerator = null;

    this.$get = function () {
        return {
            hostname: that.hostname,
            apiVersion: that.apiVersion,
            port: that.port,
            secure: that.secure,
            urls: that.urls,
            urlGenerator: that.urlGenerator,
            getPort: function (escape) {
                if (this.port) {
                    return escape ? ":" + this.port + "\\:" + this.port : ":" + this.port;
                } else {
                    return "";
                }
            },
            getUrl: function (key, escapePort) {

                var url = this.urls[key],
                    argsArray;

                if (angular.isFunction(url)) {
                    argsArray = Array.prototype.slice.call(arguments);
                    argsArray.splice(0, 2);
                    url = url.apply(null, argsArray);
                }

                if (angular.isFunction(this.urlGenerator)) {
                    return (this.hostname ? this.secure ? "https://" : "http://" : "") +
                        this.urlGenerator(this.hostname, this.getPort(escapePort), this.apiVersion) +
                        url;
                } else {
                    return (this.hostname ? this.secure ? "https://" : "http://" : "") +
                        this.hostname +
                        this.getPort(escapePort) +
                        "/v" + this.apiVersion +
                        url;
                }
            }
        }
    }
});