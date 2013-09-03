angular.module("bmComponents").directive("bmIntParser", function () {
    return {
        restrict: "A",
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (text) {
                return parseInt(text);
            });
        }
    }
});