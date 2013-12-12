angular.module("bmComponents").provider("bmAuthRequestBuffer",
    function () {

        var that = this;

        this.tokenHeaderName = "Auth-Token";
        this.unauthorizedStatusCode = 401;

        this.$get = ["$rootScope", "$injector",
            function ($rootScope, $injector) {

                var buffer = [];

                function retry(config, deferred) {
                    var $http = $injector.get("$http");
                    // remove old headers (Angular 1.1.x only);
                    delete config.headers[that.tokenHeaderName];
                    $http(config).then(function(response) {
                        deferred.resolve(response);
                    });
                }

                function retryAll() {
                    for (var i = 0; i < buffer.length; ++i) {
                        retry(buffer[i].config, buffer[i].deferred);
                    }
                    buffer = [];
                }

                return {
                    loginConfirmed: function() {
                        $rootScope.$broadcast("bmLoginConfirmed");
                        retryAll();
                    },
                    pushToBuffer: function(config, deferred) {
                        buffer.push({
                            config: config,
                            deferred: deferred
                        })
                    },
                    unauthorizedStatusCode: that.unauthorizedStatusCode
                }
            }
        ];
    }
);