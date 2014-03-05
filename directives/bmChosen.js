angular.module("bmComponents").directive("bmChosen", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            link : function(scope, element, attrs) {
                element.chosen();

                scope.$watch(attrs.bmChosen, function (data) {
                    if (data) {
                        $timeout(function () {
                            element.trigger("chosen:updated");
                        });
                    }
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
            }
        }
    }
]);