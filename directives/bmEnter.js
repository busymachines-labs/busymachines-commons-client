angular.module("bmComponents").directive('bmEnter', function () {
    return function (scope, element, attrs) {
        element.on("keyup", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.bmEnter);
                    element.blur();
                });
            }
        });
    };
});