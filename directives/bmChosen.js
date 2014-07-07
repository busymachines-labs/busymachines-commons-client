angular.module("bmComponents").directive("bmChosen", ["$timeout",
    function ($timeout) {

        return {
            restrict : "A",
            link : function(scope, element, attrs) {

                var flags = {
                    disableSearch: false,
                    noResultsText: false
                }, options = {};

                function init() {
                    var ready = true;

                    for (var i in flags) {
                        if (flags[i] === false) {
                            ready = false;
                        }
                    }

                    ready && element.chosen(options);
                }

                scope.$watch(attrs.bmChosen, function (data) {
                    if (data) {
                        $timeout(function () {
                            element.trigger("chosen:updated");
                        });
                    }
                });

                scope.$watch(attrs.ngDisabled, function (data) {
                    if (data === false || data === true) {
                        $timeout(function () {
                            element.trigger("chosen:updated");
                        });
                    }
                });

                scope.$on("switchMode", function() {
                    $timeout(function () {
                        element.next(".chosen-container").css("width", element.parent().width() + "px");
                    });
                });

                if (!isNaN(parseInt(attrs.disableSearch))) {
                    options["disable_search_threshold"] = parseInt(attrs.disableSearch);
                    flags.disableSearch = true;
                    init();
                } else {
                    options["disable_search_threshold"] = scope.$eval(attrs.disableSearch);
                    flags.disableSearch = true;
                    init();
                }

                if (!attrs.disableSearch) {
                    delete flags.disableSearch;
                    init();
                }

                if (!attrs.noResultsText) {
                    delete flags.noResultsText;
                    init();
                } else {
                    options["no_results_text"] = attrs.noResultsText;
                    flags.noResultsText = true;
                    init();
                }

            }
        }
    }
]);