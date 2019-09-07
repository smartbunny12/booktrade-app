"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("RequestService", function($resource, $cookieStore){
            var reqBooks = []; // ask others
            var tradeBooks = []; // others ask
            
            var rs = $resource("/api/requests/:id", {}, {
                post : {
                    method : "POST",
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                },
                
                delete: {
                    method : "DELETE",
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }, 
                
                getReqBooks: {
                    mehtod : "GET",
                    params: {
                        id : "reqs"   
                    },
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    },
                    isArray : true
                }, 
                
                getTradeBooks : {
                    method:"GET",
                    params:{
                        id:"trades"
                    },
                    headers:{
                        Authorization: "Bearer " + $cookieStore.get("token")
                    },
                    isArray:true
                },
            });
            
            return {
                getReqBooks : function(){
                    return rs.getReqBooks().$promise;
                }, 
                
                getTradeBooks : function(){
                    return rs.getTradeBooks().$promise;
                },
                
                addRequest : function(requester, owner, bookID){
                    return rs.post({
                        requester : requester,
                        owner : owner,
                        bookID : bookID
                    }).$promise;
                },
                
                deleteRequest: function(reqID){
                    return rs.delete({id : reqID}).$promise;
                }
            }
        });
})(window.angular);