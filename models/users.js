"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    city : String,
    state : String,
    email : String,
    password : String
});

userSchema.virtual("profile")
    .get(function(){
        return {
            email : this.email,
            city : this.city,
            state : this.state
        };
    });

module.exports = mongoose.model("User", userSchema);