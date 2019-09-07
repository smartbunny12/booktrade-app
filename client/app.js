"use strict";

(function(angular){
    angular.module("mainApp", ["ngResource", "ui.router", "ngCookies", "ngAnimate", "ui.bootstrap"])
        .run(function($rootScope, $state, AuthService){
            $rootScope.$on("$stateChangeStart", function(event, toState, toStateParam){
                console.log("Going State : ", toState);
                if(isRestricted(toState.name)){
                    console.log("Change State");
                    AuthService.authorize();
                }
            });
            function isRestricted(state){
                return state == "setting" || state == "bookList" || state == "myBook";
            }
        });
})(window.angular);