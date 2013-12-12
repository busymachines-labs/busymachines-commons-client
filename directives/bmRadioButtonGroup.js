angular.module("bmComponents").directive("bmRadioButtonGroup", [
    function () {
        return {
            replace: false,
            restrict: "A",
            template: "<div ng-include src='template'></div>",
            scope: {
                template: "=",
                radioValues: "=",
                changeValue: "&",
                radioValue: "="
            },
            link: function (scope, element, attrs) {
                scope.click = function (index) {
                    scope.radioValue = scope.radioValues[index].value;
                    scope.changeValue({
                        type: scope.radioValue
                    });
                };
            }
        }
    }
]);
