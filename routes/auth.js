var express = require("express");
const AuthController = require("../controllers/ProviderController");

var router = express.Router();

router.get("/list", AuthController.listServiceProvider);


module.exports = router;