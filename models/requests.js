"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    requester : String,
    owner : String,
    approved : {
        type : Boolean,
        default : false
    },
    bookID : String
});


module.exports = mongoose.model("Request", requestSchema);