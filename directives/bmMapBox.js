angular.module("bmComponents").directive("bmMapBox", [
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
                            if(val.length)  {
                                map.fitBounds(featureLayer.getBounds());
                            }
                        }
                    }
                }, true);
            }
        }
    }
]);