angular.module("bmComponents").filter("bmNl2Br", function () {
    return function (input) {
        var breakTag = "<br>";
        return (input + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }
});
