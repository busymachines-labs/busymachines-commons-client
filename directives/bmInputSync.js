angular.module("bmComponents").directive("bmInputSync", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            require: "?ngModel",
            link : function(scope, element, attrs, ngModel) {
                $timeout(function() {
                    if (ngModel.$pristine && element.val().length > 0) {
                        ngModel.$setViewValue(element.val());
                    }
                }, 500);
            }
        }
    }
]);
