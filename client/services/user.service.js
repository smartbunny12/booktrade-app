"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("UserService", function($cookieStore, $resource){
            return $resource("/api/users/:id", {}, {
                retrieveMe : {
                    method : "GET",
                    params : {
                        id : "me"
                    },
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                },
                
                getByEmail : {
                    method : "GET",
                    headers: {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }, 
                
                updateUser : {
                    method : "PUT",
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }
            });
        });
})(window.angular);