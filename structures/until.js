//5.04.2018 Lewiczkij M
// ��������������� �������, ��������� � 
var mongodb = require("mongodb");

var until = {}

// ��������� ������������ mongodb �������������� �� hex ������
until.getMongoObjectId = function getMongoObjectId(id) {
	var objectId = mongodb.ObjectID
	return objectId.createFromHexString(id)
}

module.exports = until