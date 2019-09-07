"use strict";

(function(angular){
    angular.module("mainApp")
        .config(function($stateProvider, $urlRouterProvider){
            $stateProvider.state("home", {
                url : "/home",
                templateUrl : "/public/home.html",
                controller : homeCntl
            })
            .state("signup", {
                url : "/signup",
                templateUrl : "/public/signup.html",
                controller : signupCntl
            })
            .state("login", {
                url : "/login",
                templateUrl : "/public/login.html",
                controller : loginCntl
            })
            .state("bookList", {
                url : "/bookList",
                templateUrl : "/public/bookList.html",
                controller : bookListCntl,
                resolve : {
                    localAuth : function(AuthService){
                        return AuthService.authorize();
                    }
                }
            })
            .state("myBook", {
                url : "/myBook",
                templateUrl : "/public/myBook.html",
                controller : myBookCntl,
                resolve : {
                    localAuth : function(AuthService){
                        return AuthService.authorize();
                    }
                }                
            })
            .state("setting", {
                url: "/setting",
                templateUrl : "/public/setting.html",
                controller : settingCntl,
                resolve : {
                    localAuth : function(AuthService){
                        return AuthService.authorize();
                    }
                }                
            });
            // $urlRouterProvider.when("/collapse1", "");
            // $urlRouterProvider.when("/collapse2", "");
            $urlRouterProvider.otherwise("/home");
        });
})(window.angular);