angular.module("bmComponents").directive('bmEnter', ["$timeout", function ($timeout) {
    return function (scope, element, attrs) {
        element.on("keyup", function (event) {
            if(event.which === 13) {
                $timeout(function (){
                    scope.$eval(attrs.bmEnter);
                });
            }
        });
    };
}]);