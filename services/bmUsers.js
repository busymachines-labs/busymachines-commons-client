angular.module("bmComponents").factory("bmUsers", ["$http", "$location", "$rootScope", "bmApiUrls", "bmCookies", "bmAuthRequestBuffer",
    function ($http, $location, $rootScope, bmApiUrls, bmCookies, bmAuthRequestBuffer) {

        function logout(data) {
            delete $http.defaults.headers.common[bmAuthRequestBuffer.tokenHeaderName];
            bmCookies.removeItem("user");
            $rootScope.$broadcast("bmLoginRequired");
            return data;
        }

        return {
            login: function (userData) {
                return $http.post(bmApiUrls.getUrl("userAuthentication"), userData)
                    .then(function (data) {
                        var expirationDate = new Date(),
                            isChrome = (/Chrome\/[.0-9]/gi).test(navigator.userAgent),
                            domain = isChrome && $location.host().indexOf(".") < 0 ? "" : $location.host();

                        expirationDate.setDate(expirationDate.getDate() + 1);
                        data.data.loginName = userData.loginName;
                        bmCookies.setItem("user", JSON.stringify(data.data), expirationDate, "/", domain);
                        $http.defaults.headers.common[bmAuthRequestBuffer.tokenHeaderName] = data.data.authToken;
                        bmAuthRequestBuffer.loginConfirmed();
                        return data;
                    });
            },
            logout: function (authToken) {
                return $http.delete(bmApiUrls.getUrl("userAuthentication") + "/" + authToken)
                    .then(logout, logout);
            }
        }
    }
]);
