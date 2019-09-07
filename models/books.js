"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title : String,
    owner : String,
    cover : String,
    active : {
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model("Book", bookSchema);