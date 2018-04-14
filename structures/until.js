//5.04.2018 Lewiczkij M
// Вспомогательные функции, связанные с 
var mongodb = require("mongodb");

var until = {}

// Получение стандартного mongodb идентификатора из hex строки
until.getMongoObjectId = function getMongoObjectId(id) {
	var objectId = mongodb.ObjectID
	return objectId.createFromHexString(id)
}

module.exports = until