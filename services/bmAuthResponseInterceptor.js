angular.module("bmComponents").factory("bmAuthResponseInterceptor", ["$q", "$rootScope", "bmAuthRequestBuffer",
    function($q, $rootScope, bmAuthRequestBuffer) {
        return {
            "responseError": function(rejection) {
                if (rejection.status === 403 && rejection.config.url.indexOf("/authentication") < 0) {
                    var deferred = $q.defer();
                    bmAuthRequestBuffer.pushToBuffer(rejection.config, deferred);
                    $rootScope.$broadcast("bmLoginRequired");
                    return deferred.promise;
                }
                // otherwise
                return $q.reject(rejection);
            }
        }
    }
]);