angular.module("bmComponents").directive("bmDatepicker", ["$timeout",
    function($timeout) {
        return {
            restrict: "A",
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel) {
                element.datepicker({
                        autoclose: true
                    })
                    .on("changeDate", function() {
                        if(!scope.$$phase) {
                            $timeout(function () {
                                ngModel.$setViewValue(element.val());
                            });
                        }
                    });

                scope.$watch(attrs.ngModel, function() {
                    element.datepicker("update");
                });
            }
        }
    }
]);