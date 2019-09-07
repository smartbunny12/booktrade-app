"use strict";

function homeCntl($scope, $state, AuthService){
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state);
    };
    AuthService.isAuthenticated()
        .then(function(res){
            console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
            $scope.currentUser = AuthService.getUser();
        });
        
    $scope.logout = function(){
        console.log("Logging out");
        AuthService.logout();
        window.location = "/";
    }
}

function signupCntl($scope, $state, AuthService){
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state); 
    };
    AuthService.isAuthenticated()
        .then(function(res){
            console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
        });
    
    $scope.showErr = false;
    
    $scope.signup = function(){
        if(!isValidEmail($scope.myEmail)){
            $scope.showErr = true;
            $scope.errInfo = "Please input correct email address";
            return;
        }
        if(!isValidPassword($scope.myPwd)){
            $scope.showErr = true;
            $scope.errInfo = "Please input valid password";
            return;
        }
        //console.log($scope.myCity, $scope.myState);
        if($scope.myCity.length == 0 || $scope.myState.length == 0) {
            $scope.showErr = true;
            $scope.errInfo = "City or State is empty!";
            return;
        }
        $scope.showErr = false;
        
        AuthService.signup($scope.myEmail, $scope.myPwd, $scope.myState, $scope.myCity)
            .then(function(res){
               // console.log(res);
                if(res.error) {
                    $scope.showErr = true;
                    $scope.errInfo = res.error;
                }else {
                    $scope.showErr = false;
                    $state.go("home");
                }
            });
    };
}

function loginCntl($scope, $state, AuthService){
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state); 
    };
    AuthService.isAuthenticated()
        .then(function(res){
           // console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
        });
    
    $scope.showErr = false;  
    $scope.login = function(){
        if(!isValidEmail($scope.myEmail)){
            $scope.showErr = true;
            $scope.errInfo = "Please input correct email address";
            return;
        }
        if(!isValidPassword($scope.myPwd)){
            $scope.showErr = true;
            $scope.errInfo = "Please input valid password";
            return;
        }
       // console.log("login, email, password : ", $scope.myEmail, $scope.myPwd);
        AuthService.login($scope.myEmail, $scope.myPwd)
            .then(function(res){
                if(res.error) {
                    $scope.showErr = true;
                    $scope.errInfo = res.error;
                }else {
                    $scope.showErr = false;
                    $state.go("home");
                }
            });
    };
}

function bookListCntl($scope, RequestService, BookService, $state, AuthService){
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state);
    };
    AuthService.isAuthenticated()
        .then(function(res){
           // console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
            $scope.currentUser = AuthService.getUser();
        });
        
    $scope.logout = function(){
       // console.log("Logging out");
        AuthService.logout();
        window.location = "/";
    };

    BookService.getMyBooks().$promise
        .then(function(mybooks){
            var mybookids = mybooks.map(function(book){
                return book._id;
            });
            RequestService.getReqBooks()
                .then(function(reqbooks){
                  //  console.log("reqsbooks : ", reqbooks);
                    var reqbookids = reqbooks.map(function(bookreq){
                        return bookreq.bookID;
                    });
                    BookService.getAllBooks().$promise
                        .then(function(allbooks){
                            $scope.myBooks1 = allbooks.map(function(book){
                                if(mybookids.indexOf(book._id) != -1 || reqbookids.indexOf(book._id) != -1) {
                                    book.ishide = true;
                                }else {
                                    book.ishide = false;
                                }
                                return book;
                            });
                        });                                
                });
        });

    $scope.sendReq = function(book){
        //console.log("sedreq book : ", book);
        RequestService.addRequest(AuthService.getUser().email, book.owner, book._id)
            .then(function(res){
               // console.log("added req : ", res);
                book.ishide = true;
                book.reqID = res._id;
                $scope.reqBooks.push(book);
            });
    };
}

function tradeCntl($scope, RequestService, BookService, AuthService, UserService, $state){
   // console.log("state: ", $state);
    $scope.reqBooks = [];
    $scope.tradeBooks = [];
    var reqRequests = [];
    var tradeRequests = [];
   // console.log("RequestService : ", RequestService, BookService);
    RequestService.getReqBooks()
        .then(function(res){
           // console.log("reqes : ", res);
           reqRequests = res;
            collectBooks(res, 0, $scope.reqBooks, BookService, UserService);
        });
    RequestService.getTradeBooks()
        .then(function(res){
            tradeRequests = res;
            collectBooks(res, 0 , $scope.tradeBooks, BookService, UserService);
        });
    $scope.acceptTradeBook = function(reqbook, index){
       // console.log("acceptBook : ", reqbook, index, tradeRequests);
        RequestService.deleteRequest(reqbook.reqID)
            .then(function(res){
                BookService.updateOwner({"id" : reqbook._id}, {"oldEmail" : AuthService.getUser().email, "newEmail" : tradeRequests[index].requester}).$promise
                    .then(function(res){
                        if(res.error) {
                            $scope.showErr = true;
                            $scope.errInfo = res.error;
                            $scope.tradeBooks = $scope.tradeBooks.filter(function(book){
                                if(book.reqID == reqbook.reqID) {
                                    return false;
                                }
                                return true;
                            });           // missing book need to delete from trade bucket                 
                            return;
                        }
                        $scope.tradeBooks = $scope.tradeBooks.filter(function(book){
                            if(book.reqID == reqbook.reqID) {
                                return false;
                            }
                            return true;
                        });
                        if($state.current.name == "bookList") {
                            $scope.myBooks1.forEach(function(book){
                                if(book._id == reqbook._id) {
                                    book.ishide = false;
                                 //   console.log("haha");
                                }
                            });   
                        }else {
                            $scope.myBooks = $scope.myBooks.filter(function(book){
                                if(book._id == reqbook._id) {
                                    return false;
                                }
                                return true;
                            });
                        }
                    });
            });
    };
    
    $scope.removeReqBook = function(reqID){
        RequestService.deleteRequest(reqID)
            .then(function(res){
                var tgBookID = "";
                $scope.reqBooks = $scope.reqBooks.filter(function(book){
                    if(book.reqID == reqID) {
                        tgBookID = book._id;
                        return false;
                    }
                    return true;
                });
               // console.log("mybooks1 : ", $scope.myBooks1);
                $scope.myBooks1.forEach(function(book){
                    if(book._id == tgBookID) {
                        book.ishide = false;
                        console.log("haha");
                    }
                });
            });
    }
}

function collectBooks(reqs, index, rtBooks, BookService, UserService) {
    if(index == reqs.length) {
     //   console.log("accor books : ", rtBooks);
        return rtBooks;
    }
    if(!reqs[index]) {
        return;
    }
        BookService.getBook({"id" : reqs[index].bookID}).$promise
            .then(function(rtbook){
               // console.log("requester : ", reqs[index].requester);
               console.log("rtbook : ", rtbook);
               if(!rtbook.owner) {
                   return;
               }
                console.log("user req: ", reqs[index].requester);
                UserService.getByEmail({"id" : reqs[index].requester}).$promise
                    .then(function(requester){
                        console.log("get requester : ", requester, reqs[index].requester);
                        rtbook.reqID = reqs[index]._id;
                        rtbook.requester = requester;
                        rtBooks.push(rtbook);
                        if(index == reqs.length) {
                            return;
                        }
                        collectBooks(reqs, index + 1, rtBooks, BookService, UserService);                        
                    });
            });
}

function myBookCntl($scope, $state, AuthService, BookService, RequestService){
   // console.log("reqsv : ", RequestService);
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state);
    };
    AuthService.isAuthenticated()
        .then(function(res){
           // console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
            $scope.currentUser = AuthService.getUser();
        });
        
    $scope.logout = function(){
       // console.log("Logging out");
        AuthService.logout();
        window.location = "/";
    };
    $scope.showErr = false;
    // populate $scope.myBooks
    BookService.getMyBooks().$promise
        .then(function(res){
            $scope.myBooks = res;
        });
    
    //populate $scope.myReqs and $scope.myTrades--Moved to my-trade directive controller
    
    
    $scope.addBook = function(){
        $scope.btnDisable = true;
        BookService.googleBook({"name" : $scope.inputBook}, {}).$promise
            .then(function(res){
                $scope.btnDisable = false;
                if(!res) {
                    $scope.showErr = true;
                    $scope.errInfo = "We don't have this book";
                }else {
                    $scope.showErr = false;
                    console.log("book : ", res);
                    $scope.myBooks.push(res);
                }
            });
    };
    
    $scope.deleteBook = function(book){
       // console.log("deleting book : ", book);
        BookService.removeBook({"id" : book._id}).$promise
            .then(function(res){
              //  console.log("Removed book : ", res);
                if(res){
                   $scope.myBooks = $scope.myBooks.filter(function(item){
                       if(item._id == book._id) {
                           return false;
                       }
                       return true;
                   }); 
                }
            });
    };
}

function settingCntl($scope, $state, AuthService, UserService){
    $scope.isActive = function(tgState){
        return isActive_local(tgState, $state);
    };
    AuthService.isAuthenticated()
        .then(function(res){
           // console.log("isAuth:", res);
            $scope.isAuthenticated = res; 
            $scope.currentUser = AuthService.getUser();
        });
        
    $scope.logout = function(){
       // console.log("Logging out");
        AuthService.logout();
        window.location = "/";
    };    
    
    //
    $scope.updateUser = function(){
        if($scope.myCity.length == 0 || $scope.myState.length == 0) {
            $scope.showErr = true;
            $scope.errInfo = "City or State is empty!";
            return;
        }
        $scope.showErr = false;      
        UserService.updateUser({
            "newstate" : $scope.myState,
            "newcity" : $scope.myCity
        }).$promise.then(function(){
            $state.go("home");
        });
    };
}

function isActive_local(tgState, state){
    return state.current.name == tgState;
}

function isValidEmail(email) {
    return /^[^\@]{3,20}\@[^\.]+\.(?:net|com|org|edu)$/.test(email);
}

function isValidPassword(pwd) {
    return pwd.length >= 6;
}