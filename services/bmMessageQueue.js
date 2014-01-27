angular.module("bmComponents").factory("bmMessageQueue", ["$rootScope", function($rootScope) {
    var messages = [];

    return {
        getMessages: function () {
            return messages;
        },
        getMessagesByType: function (type) {
            return messages.filter(function (message) {
                return type === message.type;
            });
        },
        newMessage: function (message) {
            message.timestamp = new Date();
            messages.push(message);
            $rootScope.$broadcast("bm:newMessage", {
                type: message.type
            });
        }
    }
}]);