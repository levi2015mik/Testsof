//4.04.2018 Lewiczkij M
// ����������� � mongodb ��� ����������� ������ ������ �������
"use strict"
var mongo = require("mongodb");
// ����������� � ������������ ���� ������
var path = "mongodb://localhost:27017";
var db = "test";

var connection = mongo.connect(path).
	then(
		res=>res.db(db),
		err=>console.log("Mongodb is disconnect"));
		
module.exports=connection;