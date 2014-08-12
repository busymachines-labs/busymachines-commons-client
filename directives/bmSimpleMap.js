angular.module("bmComponents").directive("bmSimpleMap", ["$timeout", "$parse",
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
                            if (markerData.icon) {
                                marker.setIcon(markerData.icon);
                            }
                        } else {
                            marker.setPosition(coords);
                        }
                        $timeout(function() {
                            google.maps.event.trigger(map, "resize");
                            map.setCenter(coords);
                        });
                    }
                }, true);

                scope.$watch(attrs.triggerResize, function(newVal) {
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
                });

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
                    if(mapData) {
                        var infowindow = new google.maps.InfoWindow();
                        var bounds = new google.maps.LatLngBounds();
                        mapData.forEach(function(location){
                            var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);
                            marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map
                            });
                            if (attrs.icon) {
                                marker.setIcon(attrs.icon);
                            }
                            bounds.extend(myLatLng);
                            google.maps.event.addListener(marker, 'click', (function(marker) {
                                return function() {
                                    infowindow.setContent(location.street + " " + location.houseNumber + " " + location.zipCode);
                                    infowindow.open(map, marker);
                                }
                            })(marker));
                        });
                    }

                    google.maps.event.addListenerOnce(map, 'idle', function(){
                        map.fitBounds(bounds);
                        map.panToBounds(bounds);
                        map.setCenter(bounds.getCenter());
                    });

                }, true);

            }
        }
    }
]);
