angular.module("bmComponents").directive("bmChosen", ["$timeout",
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
]);