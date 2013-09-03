angular.module("bmComponents").directive("bmSimpleMap", ["$timeout",
    function ($timeout) {
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
                    marker;

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
                    if (markerData && markerData.lat && markerData.lon) {
                        coords = new google.maps.LatLng(markerData.lat, markerData.lon);
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
            }
        }
    }
]);
