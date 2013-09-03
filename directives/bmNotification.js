angular.module("bmComponents").directive("bmNotification", ["$timeout", "bmMessageQueue",
    function ($timeout, bmMessageQueue) {

        return {
            restrict: "A",
            scope: {
                "template": "@bmNotificationTemplate"
            },
            replace: true,
            template: "<div ng-include src='template'></div>",
            controller: ["$scope", "$element", function($scope) {

                $scope.notification = {};

                $scope.dismiss = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.notification = {};
                };

                $scope.$on("bm:newMessage", function () {
                    var messages = bmMessageQueue.getMessages();
                    $scope.notification = messages[messages.length - 1];
                    if ($scope.notification.timeout) {
                        $timeout(function () {
                            $scope.notification = {};
                        }, $scope.notification.timeout);
                    }
                });
            }],
            link: function (scope, element, attrs, controller) {

            }
        }
    }
]);