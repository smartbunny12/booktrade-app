"use strict";

var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.load();
var verifyJwt = require("express-jwt")({secret : process.env.SESSION_SECRET});
var compose = require("composable-middleware");
var users = require("../../models/users.js");
var books = require("../../models/books.js");
var requests = require("../../models/requests.js");

exports.signToken = function(id){
    return jwt.sign({_id: id}, process.env.SESSION_SECRET);
};

exports.isAuthenticated = function(){
    return compose()
        .use(verifyJwt)
        .use(function(req, res, next){
            users.findOne({"_id" : req.user._id}, "-password" , function(err, user){
                if(err){
                    throw err;
                }
                if(!user){
                    return res.json({
                        error : "no such user " + req.user.id
                    });
                }
                req.user = user;
                return next();
            });
        });
}