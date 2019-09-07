"use strict";

(function(angular){
    angular.module("mainApp")
        .directive("myTrade", function(){
            return {
                templateUrl : "/public/trade.html",
                restrict: "E",
                controller : tradeCntl
            };
        });
})(window.angular);