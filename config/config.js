angular.module("bmComponents").config(["bmApiUrlsProvider",
    function (bmApiUrlsProvider) {
        bmApiUrlsProvider.setUrls("bm", {
            userAuthentication: "/users/authentication"
        });
    }
]);
