angular.module("bmComponents").directive("bmFloatParser", function () {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (text) {
                return parseFloat(text);
            });
        }
    }
})
