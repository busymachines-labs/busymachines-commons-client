angular.module("bmComponents").directive("bmInputSync", ["$timeout", "$interval",
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
