var express = require("express");
const app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
// var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./utils/apiResponse");
var cors = require("cors");


// DB connection

//don't show the log when it is test

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests

app.use(cors());

//Route Prefixes
// app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
    res.json("Page not found");
});

app.use((err, req, res) => {
    if (err.name == "UnauthorizedError") {
        return apiResponse.unauthorizedResponse(res, err.message);
    }
});

module.exports = app;
