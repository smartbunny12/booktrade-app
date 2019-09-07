"use strict";

var users = require("../../models/users.js");
var books = require("../../models/books.js");
var requests = require("../../models/requests.js");
var auth = require("../auth/auth.js");
var googleBook = require("googleapis").books('v1');
var dotenv = require("dotenv");
dotenv.load();


module.exports = function(){
    this.login = function(req, res, next){
      //  console.log("login req : ", req.body);
        users.findOne({"email" : req.body.email}, function(err, user){
            if(err) {
                throw err;
            }
            if(!user) {
                return res.json({
                    status : "user does not exit and please sign up"
                });
            }
           // console.log(user);
            if(user.password != req.body.password) {
                return res.json({
                    status : "password is incorrect and please retry"
                });
            }
            var rtuser = {
                email : user.email,
                state : user.state,
                city : user.city
            }
            return res.json({
                token : auth.signToken(user._id),
                user : rtuser,
                status : "SUCCESS"
            });
        });
    };
    
    this.signup = function(req, res, next){
        users.findOne({"email" : req.body.email}, "-password",function(err, user){
            if(err) {
                throw err;
            }
            if(user) {
                return res.json({
                    status : "email already exists, please login"
                });
            }
            var newuser = new users({
                email : req.body.email,
                password : req.body.password,
                state : req.body.state,
                city : req.body.city
            });
            newuser.save(function(err, newuser){
                if(err){
                    throw err;
                }
                return res.json({
                    status : "SUCCESS",
                    user : newuser,
                    token : auth.signToken(newuser._id)
                });
            });
        });
    };
    
    
    this.getMe = function(req, res, next){
        return res.json(req.user);
    };
    
    this.googleBook = function(req, res, next){
       console.log("GOOGLE BOOKS ");
        googleBook.volumes.list({
            auth : process.env.API_KEY,
            q : req.params.name
        }, function(err, data){
            if(err) {
                throw err;
            }
           // console.log("book  : ", data.items[0]);
            if(!data.items[0]) {
                return res.json(data.items[0]);
            }
            var newbook = new books({
                title : data.items[0].volumeInfo.title,
                owner : req.user.email,
                cover : data.items[0].volumeInfo.imageLinks.thumbnail,
                active : false
            });
            newbook.save(function(err, book){
                if(err) {
                    throw err;
                }
                res.json(book);
            });
        });
    };
    
    this.addRequest = function(req, res, next){
        var newReq = new requests({
            requester : req.body.requester,
            owner : req.body.owner,
            bookID : req.body.bookID,
            approved : false,
         //   bookID : req.body.bookID
        });
        newReq.save(function(err, result){
            if(err) {
                throw err;
            }
            
            return res.json(result);
        });
    };
    
    this.retrieveMyReqs = function(req, res, next){
        requests.find({"requester" : req.user.email, "approved" : false}, function(err, results){
            if(err){
                throw err;
            }
            return res.json(results);
        });
    };
    
    this.retrieveMyTrades = function(req, res, next){
        requests.find({"owner" : req.user.email, "approved" : false}, function(err, results){
            if(err) {
                throw err;
            }
            return res.json(results);
        });
    };
    
    this.removeReq = function(req, res, next){
        requests.remove({"_id" : req.params.id}, function(err, deletedReq){
            if(err) {
                throw err;
            }
            return res.json(deletedReq);
        });
    };
    
    this.getMyBooks = function(req, res, next){
        books.find({"owner" : req.user.email}, function(err, results){
            if(err){
                throw err;
            }
            return res.json(results);
        });
    };
    
    this.getBook = function(req, res, next){
       // console.log("getBook : ", req.params.id);
        books.findOne({"_id" : req.params.id}, function(err, result){
            if(err) {
                throw err;
            }
            return res.json(result);
        });
    };
    
    this.updateBookOwner = function(req, res, next){
       // console.log("update : ", req.body, req.params.id);
        books.findOneAndUpdate({"_id" : req.params.id, "owner" : req.body.oldEmail},{'$set' : {"owner" : req.body.newEmail}}, function(err, book){
            if(err){
                throw err;
            }
            console.log("findandupdate : ", book);
            if(!book) {
                return res.json({
                    error : "No corresponding book in DB"
                });
            }
            book.email = req.body.newEmail;
            book.save(function(err, newbook){
                if(err){
                    throw err;
                }
                return res.json({
                    book : newbook
                });
            });
        });
    };
    
    this.removeBook = function(req, res, next){
        books.remove({"_id" : req.params.id}, function(err, book){
            if(err){
                throw err;
            }
            return res.json(book);
        });
    };
    
    this.getAllBooks = function(req, res, next){
        books.find({}, function(err, results){
            if(err){
                throw err;
            }
            return res.json(results);
        });
    };
    
    this.getUserByEmail = function(req, res, next){
        users.findOne({"email" : req.params.id}, function(err, user){
            if(err){
                throw err;
            }
            res.json(user);
        });
        return;
    };
    
    this.updateUser = function(req, res, next){
        users.findOneAndUpdate({"_id" : req.user._id}, {"$set" : {
            "city" : req.body.newcity,
            "state" : req.body.newstate
        }}, function(err, user){
            if(err){
                throw err;
            }
            return res.json(user);
        });
    };
}