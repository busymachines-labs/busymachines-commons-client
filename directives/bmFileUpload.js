angular.module("bmComponents").directive("bmFileUpload", ["$parse", function ($parse) {
    return {
        restrict: "A",
//        scope: {
//            bmFileUpload: "=",
//            bmReadyFlag: "=",
//            ngDisabled: "="
//        },
        link: function(scope, elem, attrs) {
            var reader,
                bmFileUpload = $parse(attrs.bmFileUpload),
                bmReadyFlag = $parse(attrs.bmReadyFlag),
                file;

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                reader = new FileReader();
                reader.onload = function (data) {
                    bmFileUpload.assign(scope, {
                        id: bmFileUpload.id || "",
                        name: file.name,
                        mimeType: file.type,
                        data: data.target.result
                    });
                    bmReadyFlag.assign(scope, true);
                    scope.$apply();
                };
                elem.on("change", function(e) {
                    file = e.target.files[0];
                    reader.readAsDataURL(file);
                    bmReadyFlag.assign(scope, false);
                    scope.$apply();
                });

            }

            scope.$on("resetFileInputs", function () {
                elem.wrap('<form>').closest('form').get(0).reset();
                elem.unwrap();
            });
        }
    };
}]);