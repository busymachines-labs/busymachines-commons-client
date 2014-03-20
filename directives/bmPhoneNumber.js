angular.module("bmComponents").directive("bmPhoneNumber", [
    function () {

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {

                ngModel.$parsers.unshift(function(viewValue) {
                    var phoneRegExp = /^(\s*[\d+-?\+?]\s*)*$/g,
                        regexpValid = phoneRegExp.test(viewValue);
//                        minlengthValid = (viewValue.length >= 5),
//                        maxlengthValid = (viewValue.length <= 20),
//                        isValid = regexpValid && minlengthValid && maxlengthValid;

                    if (regexpValid) {
                        // it is valid
                        ngModel.$setValidity("phone", true);
                        return viewValue;
                    } else {
                        // it is invalid, return undefined (no model update)
                        ngModel.$setValidity("phone", false);
                        return viewValue;
                    }
                });
            }
        }
    }
]);
