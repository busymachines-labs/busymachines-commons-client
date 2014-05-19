angular.module("bmComponents").directive("bmMapBox", [
    function () {
        return {
            restrict : "A",
            link : function(scope, element, attrs) {
                var map = L.mapbox.map(element.get(0), attrs.mapKey).setView([52.285, 5.724], 7),
                    markerLayer = L.mapbox.markerLayer().addTo(map),
                    mapLoaded = false,
                    zoom,
                    mapKey;

                if (attrs.zoom) {
                    zoom = scope.$eval(attrs.zoom);
                    map.setView([52.285, 5.724], zoom);
                }

                scope.$watch(attrs.geoJson, function (val) {
                    if (val) {
                        markerLayer.setGeoJSON(val);
                    }
                }, true);
            }
        }
    }
]);