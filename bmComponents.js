angular.module("bmComponents", []);;angular.module("bmComponents").directive("bmChosen", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            link : function(scope, element, attrs) {

                var flags = {
                    disableSearch: false,
                    noResultsText: false
                }, options = {};

                function init() {
                    var ready = true;

                    for (var i in flags) {
                        if (flags[i] === false) {
                            ready = false;
                        }
                    }

                    ready && element.chosen(options);
                }

                scope.$watch(attrs.bmChosen, function (data) {
                    if (data) {
                        $timeout(function () {
                            element.trigger("chosen:updated");
                        });
                    }
                });

                scope.$watch(attrs.ngModel, function(model) {
                    element.trigger("chosen:updated");
                });

                scope.$watch(attrs.ngDisabled, function (data) {
                    if (data === false || data === true) {
                        $timeout(function () {
                            element.trigger("chosen:updated");
                        });
                    }
                });

                scope.$on("switchMode", function() {
                    $timeout(function () {
                        element.next(".chosen-container").css("width", element.parent().width() + "px");
                    });
                });

                if (!isNaN(parseInt(attrs.disableSearch))) {
                    options["disable_search_threshold"] = parseInt(attrs.disableSearch);
                    flags.disableSearch = true;
                    init();
                } else {
                    options["disable_search_threshold"] = scope.$eval(attrs.disableSearch);
                    flags.disableSearch = true;
                    init();
                }

                if (!attrs.disableSearch) {
                    delete flags.disableSearch;
                    init();
                }

                if (!attrs.noResultsText) {
                    delete flags.noResultsText;
                    init();
                } else {
                    options["no_results_text"] = attrs.noResultsText;
                    flags.noResultsText = true;
                    init();
                }

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
]);;angular.module("bmComponents").directive('bmEnter', ["$timeout", function ($timeout) {
    return function (scope, element, attrs) {
        element.on("keyup", function (event) {
            if(event.which === 13) {
                $timeout(function (){
                    scope.$eval(attrs.bmEnter);
                });
            }
        });
    };
}]);;angular.module("bmComponents").directive("bmFileUpload", ["$parse", function ($parse) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var reader,
                bmFileUpload = $parse(attrs.bmFileUpload),
                bmReadyFlag = $parse(attrs.bmReadyFlag),
                bmFileChangedFlag = $parse(attrs.bmFileChangedFlag),
                file,
                fileChanged = false;

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
                    bmFileChangedFlag.assign(scope, true);
                    if (!fileChanged) {
                        scope.$eval(attrs.bmFileChanged);
                    }
                    fileChanged = true;
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
;angular.module("bmComponents").directive("bmInputSync", ["$timeout", "$interval",
    function ($timeout, $interval) {

        return {
            restrict : "A",
            require: "?ngModel",
            link : function(scope, element, attrs, ngModel) {

                var interval,
                    continuous = scope.$eval(attrs.continuous);

                function syncValues() {
                    var value = element.val();
                    if (value && ngModel.$viewValue !== value) {
                        ngModel.$setViewValue(value);
                    }
                }

                if (continuous) {
                    interval = $interval(syncValues, 500);
                }

                scope.$on("$destroy", function () {
                    $interval.cancel(interval);
                });

                scope.$on("bmLoginRequired", function () {
                    if (!continuous) {
                        interval = $interval(syncValues, 500);
                    }
                });

                scope.$on("bmLoginConfirmed", function () {
                    if (!continuous) {
                        $interval.cancel(interval);
                    }
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
                var map = L.mapbox.map(element.get(0), attrs.mapKey).setView([52.285, 5.724], 7),
                    featureLayer = L.mapbox.featureLayer().addTo(map),
                    mapLoaded = false,
                    zoom,
                    mapKey;

                if (attrs.zoom) {
                    zoom = scope.$eval(attrs.zoom);
                    map.setView([52.285, 5.724], zoom);
                }

                scope.$watch(attrs.geoJson, function (val) {
                    if (val) {
                        featureLayer.setGeoJSON(val);
                        if('getBounds' in attrs) {
                            map.fitBounds(featureLayer.getBounds());
                        }
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
                    if ($scope.notificationType && $scope.notificationType === data.type) {
                        messages = bmMessageQueue.getMessagesByType($scope.notificationType);
                        $scope.notification = messages[messages.length - 1];
                        if ($scope.notification.timeout) {
                            $timeout(function () {
                                $scope.notification = {};
                            }, $scope.notification.timeout);
                        }
                    }
                });
            }],
            link: function (scope, element, attrs, controller) {
            }
        }
    }
]);;angular.module("bmComponents").directive("bmPager", [
    function () {
        return {
            replace: false,
            restrict: "A",
            link: function (scope, elem, attrs) {

                function redraw(items) {

                    var totalCount, barWidth, barPercentageWidth, barContainerWidth,
                        getMore, leftValue, rightValue, bar, getMorePosition;

                    items = items || scope.$eval(attrs.bmPager);
                    totalCount = scope.$eval(attrs.bmPagerTotal);
                    bar = angular.element(".loading-bar", elem);
                    barContainerWidth = angular.element(".loading-bar-container", elem).width();
                    barPercentageWidth = (items.length * 100) / totalCount;
                    barWidth = barContainerWidth * barPercentageWidth / 100;
                    getMore = angular.element(".get-more", elem);
                    leftValue = angular.element(".values.left", elem);
                    rightValue = angular.element(".values.right", elem);

//                        angular.element(".loading-bar", elem).css("width", barLength + "%");
//                        angular.element(".get-more", elem).css("left", barLength + "%");
                    angular.element(".loading-bar", elem).animate({
                        width: barPercentageWidth + "%"
                    }, 400, "swing", function () {
                        var newBarWidth = bar.width();
                        if (newBarWidth + bar.position().left > (leftValue.outerWidth() / 2) + leftValue.position().left) {
                            leftValue.addClass("inverse");
                        } else {
                            leftValue.removeClass("inverse");
                        }
                        if (newBarWidth + bar.position().left > (rightValue.outerWidth() / 2) + rightValue.position().left) {
                            rightValue.addClass("inverse");
                        } else {
                            rightValue.removeClass("inverse");
                        }
                    });

                    if ((barWidth - getMore.outerWidth() / 2 ) * 100 / barContainerWidth < 50) {

                        if (barWidth < leftValue.outerWidth() + leftValue.position().left + 10) {
                            getMorePosition = (leftValue.outerWidth() + leftValue.position().left + 10) + "px";
                        } else {
                            getMorePosition = barPercentageWidth + "%";
                        }
                        getMore.animate({
                            left: getMorePosition
                        }, 400, "swing").removeClass("inverse");
                    } else {
                        if (barWidth > rightValue.position().left) {
                            getMorePosition = (rightValue.position().left - getMore.outerWidth() - 10) + "px";
                        } else {
                            getMorePosition = ((barWidth - getMore.outerWidth() - 5) * 100 / barContainerWidth) + "%"
                        }
                        getMore.animate({
//                                left: ((barContainerWidth / 2 - getMore.outerWidth() / 2) * 100 / barContainerWidth) + "%",
                            left: getMorePosition
                        }, 400, "swing").addClass("inverse");
                    }
                }

                scope.$watch(attrs.bmPager, function (newVal) {
                    if (newVal && newVal.length) {
                        redraw(newVal);
                    }
                }, true);

                scope.$watch(attrs.bmPagerTotal, function (newVal, oldVal) {
                    if (!angular.equals(newVal, oldVal)) {
                        redraw();
                    }
                });
            }
        }
    }
]);
;angular.module("bmComponents").directive("bmPhoneNumber", [
    function () {

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {

                ngModel.$parsers.unshift(function(viewValue) {
                    var phoneRegExp = /^(\s*[\d+-?\+?]\s*)*$/g,
                        regexpValid = phoneRegExp.test(viewValue);
//                        minlengthValid = (viewValue.length >= 5),
//                        maxlengthValid = (viewValue.length <= 20),
//                        isValid = regexpValid && minlengthValid && maxlengthValid;

                    if (regexpValid) {
                        // it is valid
                        ngModel.$setValidity("phone", true);
                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ngModel.$setValidity("phone", false);
                        return viewValue;
                    }
                });
            }
        }
    }
]);
;angular.module("bmComponents").directive("bmRadioButtonGroup", [
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
;angular.module("bmComponents").directive("bmSimpleMap", ["$timeout", "$parse", "$location",
    function ($timeout, $parse, $location) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

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

                scope.$watch("visible", function (value) {
                    if (value) {
                        $timeout(function () {
                            google.maps.event.trigger(map, "resize");
                            if (coords) {
                                map.setCenter(coords);
                            }
                        });
                    }
                });

                scope.$on("switchMode", function () {
                    $timeout(function () {
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
                            if (markerData.icon) {
                                marker.setIcon(markerData.icon);
                            }
                        } else {
                            marker.setPosition(coords);
                        }
                        $timeout(function () {
                            google.maps.event.trigger(map, "resize");
                            map.setCenter(coords);
                        });
                    }
                }, true);

                scope.$watch(attrs.triggerResize, function (newVal) {
                    if (newVal) {
                        $timeout(function () {
                            google.maps.event.trigger(map, "resize");
                            if (marker) {
                                map.setCenter(marker.getPosition());
                            }
                        });
                        $timeout(function () {
                            google.maps.event.trigger(map, "resize");
                            if (marker) {
                                map.setCenter(marker.getPosition());
                            }
                        }, 200);
                        $timeout(function () {
                            google.maps.event.trigger(map, "resize");
                            if (marker) {
                                map.setCenter(marker.getPosition());
                            }
                        }, 400);
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
                                geocoder.geocode(addressObj, function (results, status) {
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
                                                if (attrs.icon) {
                                                    marker.setIcon(attrs.icon);
                                                }
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

                scope.$watch(attrs.mapData, function (mapData) {
                    if (mapData) {
                        var infowindow = new google.maps.InfoWindow();
                        var bounds = new google.maps.LatLngBounds();
                        mapData.forEach(function (location) {
                            var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);
                            marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map
                            });
                            if (attrs.icon) {
                                marker.setIcon(attrs.icon);
                            }
                            if (location.icon) {
                                marker.setIcon(location.icon);
                            }
                            bounds.extend(myLatLng);
                            if (location.tooltip) {
                                google.maps.event.addListener(marker, 'click', (function (marker) {
                                    return function () {
                                        infowindow.setContent(location.tooltip);
                                        infowindow.open(map, marker);
                                    }
                                })(marker));
                            }
                            if(attrs.goTo) {
                                google.maps.event.addListener(marker, 'click', function (marker) {
                                    var url = attrs.goTo;
                                    for (var i in location.replaceData) {
                                        url = url.replace(i, location.replaceData[i]);
                                    }
                                    scope.$apply(function() {
                                        $location.url(url);
                                    });
                                });
                            }
                        });
                        google.maps.event.addListenerOnce(map, 'idle', function () {
                            map.fitBounds(bounds);
                            map.setCenter(bounds.getCenter());
                        });
                    }

                }, true);

            }
        }
    }
]);
;angular.module("bmComponents").provider("bmApiUrls", function () {

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
        this.PAGE_SIZE = that.PAGE_SIZE;
    }

    LazyLoader.prototype.search = function (options) {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.PAGE_SIZE;

        return this.searchMethod(params, options).then(function (data) {
            instance.parseData(data);
            instance.setLoadMoreStatus();
            return data;
        });
    };

    LazyLoader.prototype.getMore = function (howMany, options) {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length + (howMany || this.PAGE_SIZE);

        if (this.destinationArray.length < this.totalCount) {
            return this.searchMethod(params, options).then(function (data) {
                instance.parseData(data);
                instance.setLoadMoreStatus();
                return data;
            });
        } else {
            return that.$q.when({});
        }
    };

    LazyLoader.prototype.refresh = function (options) {
        var params = this.getParams(),
            instance = this;

        params.from = 0;
        params.size = this.destinationArray.length;

        return this.searchMethod(params, options).then(function (data) {
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
});;angular.module("bmComponents").factory("bmMessageQueue", ["$rootScope", function($rootScope) {
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
                return $http.post(bmApiUrls.getUrl("bm","userAuthentication"), userData)
                    .then(function (data) {
                        var expirationDate = new Date(),
                            isChrome = (/Chrome\/[.0-9]/gi).test(navigator.userAgent),
                            domain = isChrome && $location.host().indexOf(".") < 0 ? "" : $location.host();

                        expirationDate.setDate(expirationDate.getDate() + 1);
                        data.data.loginName = userData.loginName;
                        bmCookies.setItem("user", JSON.stringify(data.data), expirationDate, "/", domain);
                        $http.defaults.headers.common[bmAuthRequestBuffer.tokenHeaderName] = data.data.authToken;
                        bmAuthRequestBuffer.loginConfirmed();
                        return data;
                    });
            },
            logout: function (authToken) {
                return $http.delete(bmApiUrls.getUrl("bm", "userAuthentication") + "/" + authToken)
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
        bmApiUrlsProvider.setUrls("bm", {
            userAuthentication: "/users/authentication"
        });
    }
]);
