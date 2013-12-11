angular.module("bmComponents").directive("bmMapBox", [
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
]);