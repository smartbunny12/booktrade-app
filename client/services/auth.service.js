"use strict";

(function(angular){
    angular.module("mainApp")
        .factory("AuthService", function(UserService, $q, $state, $cookieStore, $rootScope, $http){
            var currentUser = undefined;
            
            return {
                getUser:  function(){
                    return currentUser;
                },
                authenticate : function(user, signedToken) {
                    if(!user || !signedToken) {
                        return;
                    }
                    currentUser = user;
                    $cookieStore.put("token", signedToken);
                },
                isAuthenticated : function(){
                    var deferred = $q.defer();
                    if(!$cookieStore.get("token")) {
                        deferred.resolve(false);
                        return deferred.promise;
                    }
                    if(angular.isDefined(currentUser)) {
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                    UserService.retrieveMe().$promise
                        .then(function(res){
                            console.log("retrieveMe : ", res);
                            if(res.error) {
                                this.logout();
                                deferred.resolve(false);
                            }else {
                                currentUser = res;
                                deferred.resolve(true);
                            }
                        })
                        .catch(function(err){
                            deferred.resolve(false);
                        });
                    return deferred.promise;
                },
                identity: function(){
                    var deferred = $q.defer();
                    if($cookieStore.get("token")) {
                        if(angular.isDefined(currentUser)) {// if user is already there
                            deferred.resolve(currentUser);
                            return deferred.promise;
                        }
                        UserService.retrieveMe({"id" : "me"}).$promise
                            .then(function(res){
                                if(!res){
                                    deferred.resolve(null);
                                }else {
                                    deferred.resolve(res);
                                }
                            })
                            .catch(function(err){
                                throw err;
                            });
                    }else {
                        currentUser = undefined;
                        $cookieStore.remove("token");
                        deferred.resolve(null);
                    }
                    return deferred.promise;
                }, 
                
                authorize : function(){
                    this.identity()
                        .then(function(user){
                            if(!user){
                                $rootScope.returnToState = $rootScope.toState;
                                this.logout();
                                return $state.go("login");
                            }
                        }.bind(this));
                },
                
                login : function(email, password){
                    var deferred = $q.defer();
                    $http.post("/login", {
                        email : email,
                        password : password
                    }).then(function(res){
                        if(res.data.status == "SUCCESS") {
                            $cookieStore.put("token", res.data.token);
                            currentUser = res.data.user;
                            deferred.resolve(currentUser);
                        }else {
                            currentUser = undefined;
                            $cookieStore.remove("token");
                            deferred.resolve({
                                error : res.data.status
                            });
                        }
                    });
                    return deferred.promise;
                }, 
                
                signup : function(email, password, state, city){
                    var deferred = $q.defer();
                    $http.post("/signup",{
                        email : email,
                        password : password,
                        city : city,
                        state : state
                    }).then(function(res){
                        console.log("signup return : ", res.data);
                        if(res.data.status == "SUCCESS") {
                            $cookieStore.put("token", res.data.token);
                            currentUser = res.data.user;
                            deferred.resolve(currentUser);
                        }else {
                            currentUser = null;
                            $cookieStore.remove("token");
                            deferred.resolve({
                                error : res.data.status
                            });
                        }
                    });
                    return deferred.promise;
                }, 
                
                logout : function(){
                    currentUser = undefined;
                    $cookieStore.remove("token");
                }
            };
        });
})(window.angular);