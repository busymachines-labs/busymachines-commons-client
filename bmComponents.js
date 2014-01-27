angular.module("bmComponents", []);;angular.module("bmComponents").directive("bmChosen", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            link : function(scope, element, attrs) {
                element.chosen();

                scope.$watch(attrs.bmChosen, function (data) {
                    if (data) element.trigger("chosen:updated");
                });

                scope.$watch(attrs.ngDisabled, function (data) {
                    if (data === false || data === true) element.trigger("chosen:updated");
                });

                scope.$on("switchMode", function() {
                    var classes = element.attr("class").split(/\s+/),
                        spanClass = classes.filter(function (className) {
                            return className.indexOf("span") > -1;
                        })[0];

                    element.before("<p class='" + spanClass + " hidden'></p>");
                    element.next(".chosen-container").css("width", element.prev().css("width"));
                });
            }
        }
    }
]);;angular.module("bmComponents").directive("bmDateParser", function () {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {

            var viewFormat = attrs.bmDateParser.split(",")[0],
                modelFormat = attrs.bmDateParser.split(",")[1];

            ngModel.$parsers.push(function (text) {
                if (modelFormat) {
                    return moment(text, viewFormat).format(modelFormat);
                } else {
                    return moment(text, viewFormat).toISOString();
                }
            });

            ngModel.$formatters.push(function (text) {
                if (!text) {
                    return "";
                } else {
                    return moment(text, modelFormat).format(viewFormat);
                }
            });
        }
    }
})
;angular.module("bmComponents").directive("bmDatepicker", ["$timeout",
    function($timeout) {
        return {
            restrict: "A",
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                element.datepicker({
                        autoclose: true
                    })
                    .on("changeDate", function() {
                        if(!scope.$$phase) {
                            $timeout(function () {
                                ngModel.$setViewValue(element.val());
                            });
                        }
                    });

                scope.$watch(attrs.ngModel, function() {
                    element.datepicker("update");
                });
            }
        }
    }
]);;angular.module("bmComponents").directive("bmFileUpload", ["$parse", function ($parse) {
    return {
        restrict: "A",
//        scope: {
//            bmFileUpload: "=",
//            bmReadyFlag: "=",
//            ngDisabled: "="
//        },
        link: function(scope, elem, attrs) {
            var reader,
                bmFileUpload = $parse(attrs.bmFileUpload),
                bmReadyFlag = $parse(attrs.bmReadyFlag),
                file;

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                reader = new FileReader();
                reader.onload = function (data) {
                    bmFileUpload.assign(scope, {
                        id: bmFileUpload.id || "",
                        name: file.name,
                        mimeType: file.type,
                        data: data.target.result
                    });
                    bmReadyFlag.assign(scope, true);
                    scope.$apply();
                };
                elem.on("change", function(e) {
                    file = e.target.files[0];
                    reader.readAsDataURL(file);
                    bmReadyFlag.assign(scope, false);
                    scope.$apply();
                });

            }

            scope.$on("resetFileInputs", function () {
                elem.wrap('<form>').closest('form').get(0).reset();
                elem.unwrap();
            });
        }
    };
}]);;angular.module("bmComponents").directive("bmFloatParser", function () {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (text) {
                return parseFloat(text);
            });
        }
    }
})
;angular.module("bmComponents").directive("bmInputSync", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            require: "?ngModel",
            link : function(scope, element, attrs, ngModel) {

                var timer;

                function startTimer() {
                    timer = $timeout(function () {
                        var value = element.val();
                        if (value && ngModel.$viewValue !== value) {
                            ngModel.$setViewValue(value);
                        }
                        startTimer();
                    }, 500);
                }

                scope.$on("$destroy", function () {
                    $timeout.cancel(timer);
                });

                scope.$on("bmLoginRequired", startTimer);

                scope.$on("bmLoginConfirmed", function () {
                    $timeout.cancel(timer);
                });
            }
        }
    }
]);
;angular.module("bmComponents").directive("bmIntParser", function () {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (text) {
                return parseInt(text);
            });
        }
    }
});;angular.module("bmComponents").directive("bmMapBox", [
    function () {
        return {
            restrict : "A",
            link : function(scope, element, attrs) {
                var map = L.mapbox.map(element.get(0), "agilexs.ggma3d04").setView([52.285, 5.724], 7),
                    markerLayer = L.mapbox.markerLayer().addTo(map),
                    mapLoaded = false;

                scope.$watch(attrs.geoJson, function (val) {
                    if (val) {
                        markerLayer.setGeoJSON(val);
                    }
                }, true);
            }
        }
    }
]);;angular.module("bmComponents").directive("bmNotification", ["$timeout", "bmMessageQueue",
    function ($timeout, bmMessageQueue) {

        return {
            restrict: "A",
            scope: {
                "template": "=bmNotificationTemplate",
                "notificationType": "@"
            },
            replace: true,
            template: "<div ng-include src='template'></div>",
            controller: ["$scope", "$element", function($scope) {

                $scope.dismiss = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.notification = {};
                };

                $scope.$on("bm:newMessage", function ($e, data) {
                    var messages;
                    if ($scope.notificationType) {
                        messages = bmMessageQueue.getMessagesByType($scope.notificationType);
                    } else {
                        messages = bmMessageQueue.getMessages();
                    }
                    $scope.notification = messages[messages.length - 1];
                    if ($scope.notification.timeout) {
                        $timeout(function () {
                            $scope.notification = {};
                        }, $scope.notification.timeout);
                    }
                });
            }],
            link: function (scope, element, attrs, controller) {
            }
        }
    }
]);;angular.module("bmComponents").directive("bmRadioButtonGroup", [
    function () {
        return {
            replace: false,
            restrict: "A",
            template: "<div ng-include src='template'></div>",
            scope: {
                template: "=",
                radioValues: "=",
                changeValue: "&",
                radioValue: "="
            },
            link: function (scope, element, attrs) {
                scope.click = function (index) {
                    scope.radioValue = scope.radioValues[index].value;
                    scope.changeValue({
                        type: scope.radioValue
                    });
                };
            }
        }
    }
]);
;angular.module("bmComponents").directive("bmSimpleMap", ["$timeout", "$parse",
    function ($timeout, $parse) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {

                google.maps.visualRefresh = true;

                var options = {
                        center: new google.maps.LatLng(52.402419, 4.921446),
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    },
                    map = new google.maps.Map(element.get(0), options),
                    coords,
                    marker,
                    timeoutPromise;

                scope.$watch("visible", function(value) {
                    if (value) {
                        $timeout(function() {
                            google.maps.event.trigger(map, "resize");
                            if (coords) {
                                map.setCenter(coords);
                            }
                        });
                    }
                });

                scope.$on("switchMode", function () {
                    $timeout(function() {
                        google.maps.event.trigger(map, "resize");
                    });
                });

                scope.$watch(attrs.mapCenter, function (coords) {
                    if (coords) {
                        map.setCenter(new google.maps.LatLng(coords.lat, coords.lon));
                    }
                });

                scope.$watch(attrs.mapMarker, function (markerData) {
                    if (markerData && markerData.latitude && markerData.longitude) {
                        coords = new google.maps.LatLng(markerData.latitude, markerData.longitude);
                        if (!marker) {
                            marker = new google.maps.Marker({
                                position: coords,
                                map: map
                            });
                        } else {
                            marker.setPosition(coords);
                        }
                        map.setCenter(coords);
                    }
                }, true);

                scope.$watch(attrs.geolocationData, function (newValue, oldValue) {

                    var addressObj,
                        geocoder = new google.maps.Geocoder(),
                        locationLatitudeSetter = $parse(attrs.latitude).assign,
                        locationLongitudeSetter = $parse(attrs.longitude).assign;

                    if (newValue && oldValue && (newValue.street !== oldValue.street || newValue.houseNumber !== oldValue.houseNumber
                        || newValue.zipCode !== oldValue.zipCode || newValue.city !== oldValue.city)) {
                        $timeout.cancel(timeoutPromise);
                        if (newValue && newValue.street && newValue.houseNumber && newValue.zipCode && newValue.city) {
                            timeoutPromise = $timeout(function () {
                                addressObj = {
                                    address: newValue.street + " " + newValue.houseNumber + " " +
                                        (newValue.houseNumberSuffix ? newValue.houseNumberSuffix : "") +
                                        newValue.zipCode + " " + newValue.city
                                };
                                geocoder.geocode(addressObj, function(results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        scope.$apply(function () {
                                            locationLatitudeSetter(scope, results[0].geometry.location.lat());
                                            locationLongitudeSetter(scope, results[0].geometry.location.lng());
                                            coords = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                                            if (!marker) {
                                                marker = new google.maps.Marker({
                                                    position: coords,
                                                    map: map
                                                });
                                            } else {
                                                marker.setPosition(coords);
                                            }
                                            map.setCenter(coords);
                                        });
                                    }
                                });
                            }, 1000);
                        }
                    }
                }, true);
            }
        }
    }
]);
;angular.module("bmComponents").provider("bmApiUrls", function () {

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
});;angular.module("bmComponents").provider("bmAuthRequestBuffer",
    function () {

        var that = this;

        this.tokenHeaderName = "Auth-Token";
        this.unauthorizedStatusCode = 401;

        this.$get = ["$rootScope", "$injector",
            function ($rootScope, $injector) {

                var buffer = [];

                function retry(config, deferred) {
                    var $http = $injector.get("$http");
                    // remove old headers (Angular 1.1.x only);
                    delete config.headers[that.tokenHeaderName];
                    $http(config).then(function(response) {
                        deferred.resolve(response);
                    });
                }

                function retryAll() {
                    for (var i = 0; i < buffer.length; ++i) {
                        retry(buffer[i].config, buffer[i].deferred);
                    }
                    buffer = [];
                }

                return {
                    unauthorizedStatusCode: that.unauthorizedStatusCode,
                    tokenHeaderName: that.tokenHeaderName,
                    loginConfirmed: function() {
                        $rootScope.$broadcast("bmLoginConfirmed");
                        retryAll();
                    },
                    pushToBuffer: function(config, deferred) {
                        buffer.push({
                            config: config,
                            deferred: deferred
                        })
                    }
                }
            }
        ];
    }
);;angular.module("bmComponents").factory("bmAuthResponseInterceptor", ["$q", "$rootScope", "bmAuthRequestBuffer",
    function($q, $rootScope, bmAuthRequestBuffer) {
        return {
            "responseError": function(rejection) {
                if (rejection.status === bmAuthRequestBuffer.unauthorizedStatusCode && rejection.config.url.indexOf("/authentication") < 0) {
                    var deferred = $q.defer();
                    bmAuthRequestBuffer.pushToBuffer(rejection.config, deferred);
                    $rootScope.$broadcast("bmLoginRequired");
                    return deferred.promise;
                }
                // otherwise
                return $q.reject(rejection);
            }
        }
    }
]);;angular.module("bmComponents").provider("bmCookies", function () {

    var that = this;

    this.cookiePrefix = "bm";

    this.$get = function () {
        // taken from https://developer.mozilla.org/en-US/docs/DOM/document.cookie
        return {
            cookiePrefix: that.cookiePrefix,
            getItem: function (sKey) {
                if (!sKey || !this.hasItem(sKey)) { return null; }
                sKey = this.cookiePrefix + sKey;
                return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
            },
            setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
                sKey = this.cookiePrefix + sKey;
                if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
                var sExpires = "";
                if (vEnd) {
                    switch (vEnd.constructor) {
                        case Number:
                            sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                            break;
                        case String:
                            sExpires = "; expires=" + vEnd;
                            break;
                        case Date:
                            sExpires = "; expires=" + vEnd.toGMTString();
                            break;
                    }
                }
                document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            },
            removeItem: function (sKey, sPath) {
                if (!sKey || !this.hasItem(sKey)) { return; }
                sKey = this.cookiePrefix + sKey;
                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
            },
            hasItem: function (sKey) {
                sKey = sKey ? this.cookiePrefix + sKey : undefined;
                return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            },
            keys: function () {
                var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
                for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
                return aKeys;
            }
        };

    };
});;angular.module("bmComponents").factory("bmHash", ["$location",
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
;angular.module("bmComponents").provider("bmLazyLoader", function () {

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
            instance.parseData(data);
            return data;
        });
    }

    LazyLoader.prototype.getMore = function (howMany) {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length + (howMany || this.PAGE_SIZE);

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
            instance.parseData(data);
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
;angular.module("bmComponents").factory("bmMessageQueue", ["$rootScope", function($rootScope) {
    var messages = [];

    return {
        getMessages: function () {
            return messages;
        },
        getMessagesByType: function (type) {
            return messages.filter(function (message) {
                return type === message.type;
            });
        },
        newMessage: function (message) {
            message.timestamp = new Date();
            messages.push(message);
            $rootScope.$broadcast("bm:newMessage", {
                type: message.type
            });
        }
    }
}]);;angular.module("bmComponents").factory("bmUsers", ["$http", "$location", "$rootScope", "bmApiUrls", "bmCookies", "bmAuthRequestBuffer",
    function ($http, $location, $rootScope, bmApiUrls, bmCookies, bmAuthRequestBuffer) {

        function logout(data) {
            delete $http.defaults.headers.common[bmAuthRequestBuffer.tokenHeaderName];
            bmCookies.removeItem("user");
            $rootScope.$broadcast("bmLoginRequired");
            return data;
        }

        return {
            login: function (userData) {
                return $http.post(bmApiUrls.getUrl("userAuthentication"), userData)
                    .then(function (data) {
                        var expirationDate = new Date(),
                            isChrome = (/Chrome\/[.0-9]/gi).test(navigator.userAgent),
                            domain = isChrome && $location.host() === "localhost" ? "" : $location.host();

                        expirationDate.setDate(expirationDate.getDate() + 1);
                        data.data.loginName = userData.loginName;
                        bmCookies.setItem("user", JSON.stringify(data.data), expirationDate, "/", domain);
                        $http.defaults.headers.common[bmAuthRequestBuffer.tokenHeaderName] = data.data.authToken;
                        bmAuthRequestBuffer.loginConfirmed();
                        return data;
                    });
            },
            logout: function (authToken) {
                return $http.delete(bmApiUrls.getUrl("userAuthentication") + "/" + authToken)
                    .then(logout, logout);
            }
        }
    }
]);
;angular.module("bmComponents").filter("bmDate", function () {
    return function (value, toFormat, fromFormat) {
        var dateObj;

        if (!value || !toFormat) {
            return;
        }

        if (fromFormat) {
            dateObj = moment(value, fromFormat);
        } else {
            dateObj = moment(value);
        }

        if (dateObj.isValid()) {
            return dateObj.format(toFormat);
        }
    };
});;angular.module("bmComponents").filter("bmDuration", function () {
    return function (value, toFormat, fromFormat) {
        var durationObj;

        if ((!value && value != 0) || !toFormat) {
            return;
        }

        if (fromFormat) {
            durationObj = moment.duration(value, fromFormat);
        } else {
            durationObj = moment.duration(value);
        }

        return durationObj.format(toFormat);
    };
});;angular.module("bmComponents").filter("bmNl2Br", function () {
    return function (input) {
        var breakTag = "<br>";
        return (input + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
});
;angular.module("bmComponents").config(["bmApiUrlsProvider",
    function (bmApiUrlsProvider) {
        bmApiUrlsProvider.urls.userAuthentication = "/users/authentication";
    }
]);
