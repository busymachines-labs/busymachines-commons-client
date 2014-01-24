angular.module("bmComponents").factory("bmHash", ["$location",
    function ($location) {
        return {
            serializeObject: function (data) {
                var i,
                    resultArr = [];

                for (i in data) {
                    if (data.hasOwnProperty(i)) {
                        if (angular.isArray(data[i])) {
                            if (data[i].length) {
                                resultArr.push(i + "=" + data[i].join(","));
                            }
                        } else if (data[i] !== undefined && data[i] !== null && data[i] !== "") {
                            resultArr.push(i + "=" + data[i]);
                        }
                    }
                }

                return resultArr.join("&");
            },
            getData: function () {
                var dataArr = $location.hash().split("&"),
                    result = {};

                dataArr.forEach(function (paramSet) {
                    var params = paramSet.split("=");

                    if (params[0] && params[1])
                        result[params[0]] = params[1];
                });

                return result;
            },
            setData: function (data) {
                $location.hash(this.serializeObject(data));
            }
        };
    }
]);
