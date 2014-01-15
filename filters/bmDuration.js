angular.module("bmComponents").filter("bmDuration", function () {
    return function (value, toFormat, fromFormat) {
        var durationObj;

        if ((!value && value != 0) || !toFormat) {
            return;
        }

        if (fromFormat) {
            durationObj = moment.duration(value, fromFormat);
        } else {
            durationObj = moment.duration(value);
        }

        return durationObj.format(toFormat);
    };
});