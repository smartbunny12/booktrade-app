"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("BookService", function($resource, $cookieStore){
            return $resource("/api/books/:name/:id",{},{
                googleBook : {
                    method : "POST",
                    headers: {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }, 
                
                getMyBooks : {
                    method : "GET",
                    params: {
                      name : "me"  
                    },
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    },
                    isArray : true
                },
                
                getBook : {
                    method : "GET",
                    params: {
                        name : "book"    
                    },
                    headers: {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }, 
                
                updateOwner : {
                    method : "PUT",
                    params : {
                        name : "updateOwner"    
                    },
                    headers: {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                },
                
                removeBook : {
                    method : "DELETE",
                    headers : {
                        Authorization : "Bearer " + $cookieStore.get("token")
                    }
                }, 
                
                getAllBooks : {
                    method : "GET",
                    isArray : true
                }
            })
        });
})(window.angular);