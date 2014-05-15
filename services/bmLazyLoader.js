angular.module("bmComponents").provider("bmLazyLoader", function () {

    var that = this;

    this.PAGE_SIZE = 10;

    function LazyLoader (searchMethod, paramsObj, destination) {
        this.searchMethod = searchMethod;
        this.params = paramsObj;
        this.destinationArray = destination;
        this.PAGE_SIZE = that.PAGE_SIZE;
    }

    LazyLoader.prototype.search = function () {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.PAGE_SIZE;

        return this.searchMethod(params).then(function (data) {
            instance.parseData(data);
            instance.setLoadMoreStatus();
            return data;
        });
    };

    LazyLoader.prototype.getMore = function (howMany) {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length + (howMany || this.PAGE_SIZE);

        if (this.destinationArray.length < this.totalCount) {
            return this.searchMethod(params).then(function (data) {
                instance.parseData(data);
                instance.setLoadMoreStatus();
                return data;
            });
        } else {
            return that.$q.when({});
        }
    };

    LazyLoader.prototype.refresh = function () {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length;

        return this.searchMethod(params).then(function (data) {
            instance.parseData(data);
            instance.setLoadMoreStatus();
            return data;
        });
    };

    LazyLoader.prototype.getParams = function () {
        var i, params = {};

        for (i in this.params) {
            if (this.params.hasOwnProperty(i)) {
                if (angular.isArray(this.params[i])) {
                    if (this.params[i].length) {
                        params[i] = this.params[i].join(",");
                    }
                } else if (typeof this.params[i] === "boolean") {
                    params[i] = this.params[i];
                } else if (angular.isNumber(this.params[i])) {
                    params[i] = this.params[i];
                } else if (angular.isString(this.params[i]) && this.params[i].length > 0) {
                    params[i] = this.params[i];
                }
            }
        }

        return params;
    };

    LazyLoader.prototype.parseData = function (data) {
        var keys = Object.keys(data.data),
            resultPropName;

        this.totalCount = data.data.totalCount;

        resultPropName = keys.filter(function (prop) {
            return prop !== "totalCount" && prop !== "facets";
        })[0];

        this.destinationArray.length = 0;
        this.destinationArray.push.apply(this.destinationArray, data.data[resultPropName]);
    };

    LazyLoader.prototype.setLoadMoreStatus = function () {
        this.showLoadMore = this.destinationArray.length > 0 && this.totalCount != this.destinationArray.length;
    };

    LazyLoader.prototype.PAGE_SIZE = this.PAGE_SIZE;

    this.$get = ["$q",
        function ($q) {
            that.$q = $q;
            return {
                newLoader: function (searchMethod, paramsObj, destination) {
                    return new LazyLoader(searchMethod, paramsObj, destination);
                }
            }
        }
    ]
});
