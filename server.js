var express = require("express"),
  dotenv = require("dotenv"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  routes = require(process.cwd() + "/server/routers");

dotenv.load();

var app = express();

var db = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookjump");

// middlewares
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controllers", express.static(process.cwd() + '/client/controllers'));
app.use("/client", express.static(process.cwd() + "/client"));
app.use("/node_modules", express.static(process.cwd() + "/node_modules"));

//routes
routes(app);

//connecting server
app.listen(process.env.PORT || 8080, function(){
  console.log("express server is listening on port " + process.env.PORT || "8080");
});