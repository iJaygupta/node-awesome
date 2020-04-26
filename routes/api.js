var express = require("express");
var authRouter = require("./auth");

var app = express();

app.use("/provider/", authRouter);

module.exports = app;