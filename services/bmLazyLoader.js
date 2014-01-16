angular.module("bmComponents").provider("bmLazyLoader", function () {

    var that = this;

    this.PAGE_SIZE = 10;

    function LazyLoader (searchMethod, paramsObj, destination) {
        this.searchMethod = searchMethod;
        this.params = paramsObj;
        this.destinationArray = destination;
    }

    LazyLoader.prototype.search = function () {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.PAGE_SIZE;

        return this.searchMethod(params).then(function (data) {
            instance.parseData(data, true);
            return data;
        });
    }

    LazyLoader.prototype.getMore = function (howMany) {
        var params = this.getParams(),
            instance = this;

        params.from = this.destinationArray.length;
        params.to = howMany || this.PAGE_SIZE;

        if (this.destinationArray.length < this.totalCount) {
            return this.searchMethod(params).then(function (data) {
                instance.parseData(data);
                return data;
            });
        } else {
            return that.$q.when({});
        }
    }

    LazyLoader.prototype.refresh = function () {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length;

        return this.searchMethod(params).then(function (data) {
            instance.parseData(data, true);
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
                } else if (this.params[i]) {
                    params[i] = this.params[i];
                }
            }
        }

        return params;
    };

    LazyLoader.prototype.parseData = function (data, overwrite) {
        var keys = Object.keys(data.data),
            resultPropName;

        this.totalCount = data.data.totalCount;

        resultPropName = keys.filter(function (prop) {
            return prop !== "totalCount" && prop !== "facets";
        })[0];

        if (overwrite) {
            this.destinationArray.length = 0;
        }

        this.destinationArray.push.apply(this.destinationArray, data.data[resultPropName]);
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
