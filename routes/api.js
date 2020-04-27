var express = require("express");
var providerRouter = require("./provider");

var app = express();

app.use("/provider/", providerRouter);

module.exports = app;