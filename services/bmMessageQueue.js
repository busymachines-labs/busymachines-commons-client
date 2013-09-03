angular.module("bmComponents").factory("bmMessageQueue", ["$rootScope", function($rootScope) {
    var messages = [];

    return {
        getMessages: function () {
            return messages;
        },
        newMessage: function (message) {
            message.timestamp = new Date();
            messages.push(message);
            $rootScope.$broadcast("bm:newMessage");
        }
    }
}]);