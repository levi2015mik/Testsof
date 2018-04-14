//4.04.2018 Lewiczkij M
// Подключение к mongodb для последующей работы других модулей
"use strict"
var mongo = require("mongodb");
// Подключение и используемая база данных
// if(process.env.MONGODB_URI != undefined) {
// 	var path = process.env.MONGODB_URI;
// 	var db = "heroku_f069r4wl"
// }
// else{
	var path = "mongodb://localhost:27017"
	var db = "test";
// }

var connection = mongo.connect(path).
	then(
		res=>res.db(db),
		err=>console.log("Mongodb is disconnect"));
		
module.exports=connection;