angular.module("bmComponents").config(["bmApiUrlsProvider",
    function (bmApiUrlsProvider) {
        bmApiUrlsProvider.urls.userAuthentication = "/users/authentication";
    }
]);
