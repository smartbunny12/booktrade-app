"use strict";

(function(angular){
    angular.module("mainApp")
        .directive("myNavbar", function(){
            return {
                templateUrl : "/public/navbar.html",
                restrict : "E",
            }; 
        });
})(window.angular);