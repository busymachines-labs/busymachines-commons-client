angular.module("bmComponents").directive("bmInputSync", ["$timeout",
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
