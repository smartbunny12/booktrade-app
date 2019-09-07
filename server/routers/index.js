"use strict";

var users = require("../../models/users.js");
var books = require("../../models/books.js");
var requests = require("../../models/requests.js");
var auth = require("../auth/auth.js");
var cntlClass = require("../controllers/server.controller.js");

module.exports = function(app){
    var cntl = new cntlClass();
    
    app.get("/", function(req, res, next){
        return res.sendfile(process.cwd() + "/public/index.html");
    });
    
    //user api
    app.get("/api/users/me", auth.isAuthenticated(), cntl.getMe);
    app.get("/api/users/:id", auth.isAuthenticated(), cntl.getUserByEmail);
    app.put("/api/users", auth.isAuthenticated(), cntl.updateUser)
    //book api
    
    //requiest api
    app.post("/api/requests", auth.isAuthenticated(), cntl.addRequest);
    app.get("/api/requests/reqs", auth.isAuthenticated(), cntl.retrieveMyReqs);
    app.get("/api/requests/trades", auth.isAuthenticated(), cntl.retrieveMyTrades);
    app.delete("/api/requests/:id", auth.isAuthenticated(), cntl.removeReq);
    
    //book api
    app.get("/api/books", cntl.getAllBooks)
    app.get("/api/books/me", auth.isAuthenticated(), cntl.getMyBooks);
    app.put("/api/books/updateOwner/:id", auth.isAuthenticated(), cntl.updateBookOwner);
    app.get("/api/books/book/:id", auth.isAuthenticated(), cntl.getBook);
    app.post("/api/books/:name", auth.isAuthenticated(), cntl.googleBook);
    app.delete("/api/books/:id", auth.isAuthenticated(), cntl.removeBook)
    
    //misc
    app.post("/login", cntl.login);
    
    app.post("/signup", cntl.signup);
    
    app.get("/logout", function(){
        
    });
    
    //err handler
    app.use(function(err, req, res, next){
        console.log("headers : ", req.headers);
        console.log(err);
        return res.sendfile(process.cwd() + "/public/unauth.html");
    });
};