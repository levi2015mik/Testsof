//4.04.2018 Lewiczkij M
// Подключение к mongodb для последующей работы других модулей
"use strict"
var mongo = require("mongodb");
// Подключение и используемая база данных
var path = process.env.MONGODB_URI;
var db = "test";

var connection = mongo.connect(path).
	then(
		res=>res.db(db),
		err=>console.log("Mongodb is disconnect"));
		
module.exports=connection;