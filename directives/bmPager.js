angular.module("bmComponents").directive("bmPager", [
    function () {
        return {
            replace: false,
            restrict: "A",
            link: function (scope, elem, attrs) {
                scope.$watch(attrs.fdcPager, function (newVal, oldVal) {
                    var totalCount, barWidth, barPercentageWidth, barContainerWidth,
                        getMore, leftValue, rightValue, bar, getMorePosition;
                    if (newVal && newVal.length) {
                        totalCount = scope[attrs.bmPagerTotal];
                        bar = angular.element(".loading-bar", elem);
                        barContainerWidth = angular.element(".loading-bar-container", elem).width();
                        barPercentageWidth = (newVal.length * 100) / totalCount;
                        barWidth = barContainerWidth * barPercentageWidth / 100;
                        getMore = angular.element(".get-more", elem);
                        leftValue = angular.element(".values.left", elem);
                        rightValue = angular.element(".values.right", elem);

//                        angular.element(".loading-bar", elem).css("width", barLength + "%");
//                        angular.element(".get-more", elem).css("left", barLength + "%");
                        angular.element(".loading-bar", elem).animate({
                            width: barPercentageWidth + "%"
                        }, 400, "swing", function () {
                            var newBarWidth = bar.width();
                            if (newBarWidth + bar.position().left > (leftValue.outerWidth() / 2) + leftValue.position().left) {
                                leftValue.addClass("inverse");
                            } else {
                                leftValue.removeClass("inverse");
                            }
                            if (newBarWidth + bar.position().left > (rightValue.outerWidth() / 2) + rightValue.position().left) {
                                rightValue.addClass("inverse");
                            } else {
                                rightValue.removeClass("inverse");
                            }
                        });

                        if ((barWidth - getMore.outerWidth() / 2 ) * 100 / barContainerWidth < 50) {

                            if (barWidth < leftValue.outerWidth() + leftValue.position().left + 10) {
                                getMorePosition = (leftValue.outerWidth() + leftValue.position().left + 10) + "px";
                            } else {
                                getMorePosition = barPercentageWidth + "%";
                            }
                            getMore.animate({
                                left: getMorePosition
                            }, 400, "swing").removeClass("inverse");
                        } else {
                            if (barWidth > rightValue.position().left) {
                                getMorePosition = (rightValue.position().left - getMore.outerWidth() - 10) + "px";
                            } else {
                                getMorePosition = ((barWidth - getMore.outerWidth() - 5) * 100 / barContainerWidth) + "%"
                            }
                            getMore.animate({
//                                left: ((barContainerWidth / 2 - getMore.outerWidth() / 2) * 100 / barContainerWidth) + "%",
                                left: getMorePosition
                            }, 400, "swing").addClass("inverse");
                        }
                    }
                }, true);
            }
        }
    }
]);
