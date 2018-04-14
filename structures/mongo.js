//4.04.2018 Lewiczkij M
// Подключение к mongodb для последующей работы других модулей
"use strict"
var mongo = require("mongodb");

var path = process.env.MONGODB_URI;
var db = "heroku_f069r4wl"

var connection = mongo.connect(path).
	then(
		res=>res.db(db),
		err=>console.log("Mongodb is disconnect"));
		
module.exports=connection;