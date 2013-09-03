angular.module("bmComponents").provider("bmApiUrls", function () {

    var that = this;

    this.hostname = "";
    this.apiVersion = "";
    this.port = "";
    this.secure = false;
    this.urls = {};

    this.$get = function () {
        return {
            hostname: that.hostname,
            apiVersion: that.apiVersion,
            port: that.port,
            secure: that.secure,
            urls: that.urls,
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

                return (this.secure ? "https://" : "http://") +
                    this.hostname +
                    this.getPort(escapePort) +
                    "/v" + this.apiVersion +
                    url;
            }
        }
    }
});