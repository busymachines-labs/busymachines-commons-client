angular.module("bmComponents").filter("bmDate", function () {
    return function (value, toFormat, fromFormat) {
        var dateObj;

        if (!value || !toFormat) {
            return;
        }

        if (fromFormat) {
            dateObj = moment(value, fromFormat);
        } else {
            dateObj = moment(value);
        }

        if (dateObj.isValid()) {
            return dateObj.format(toFormat);
        }
    };
});