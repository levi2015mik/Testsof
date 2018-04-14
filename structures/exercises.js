//5.04.2018 Lewiczkij M
/**
* Функционал, связанный с сохранением в базы и извлечением наборов параметров 
* для генерации упражнений. Предусмотрено занесение в базу и извлечение списка с учетом разных условий
* А также редактирование данных о пользователях, для которых предназначено упражнение в виде
* directs:[ "5ac5493bfa3aed6ec1c84e4e",
*		    "5ac54a60ee0e8c011063584b" ]    
*/
var mongo = require("./mongo")
var until = require("./until")

// Название mongodb коллекции
var collectionName = "exercises";

var exercises = {}

// Добавление
exercises.add = function add(ex){
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.insert(ex)).
	then(res => {return res.insertedIds[0].toString()})
}

// Удаление по _id
exercises.del = function del(eid){
		try{ var id = until.getMongoObjectId(eid)}
	catch(err){
		return Promise.reject(TypeError("exercise`s ID is uncorrect!"))
	}
	
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.deleteOne({"_id":id})).
	then(res => {
		if(res.result.n == 1) return true;
		else return Promise.reject(Error("Deleted exercise not found"));
	})

}

// Получить все
exercises.getAll = function getAll(){
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.find({})).
	then(res => res.toArray())
}

// Получить, адресованные конкретному пользователю 
exercises.getOfUser = function getOfUser(uid){
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.find({"directs":uid})).
		then(res => res.toArray())
}

//
exercises.getbyId = function getbyId(id){
	id = until.getMongoObjectId(id);
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.find({"_id":id})).
		then(res => res.toArray())
}

// Адресование и редактирование адресаций пользователям
exercises.direct = function direct(eid,directs){
	for(var i = 0;i < directs.length;i++){
		try{ var id = until.getMongoObjectId(directs[i])}
		catch(err){
			return Promise.reject(TypeError("One of directs are uncorrect!"))
		}
	}
	eid = until.getMongoObjectId(eid)
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.updateOne({"_id":eid},{"$set":{"directs":directs}}))
}

// Удаление коллекции и создание новой с заданной структурой
// Эта операция производитсяв целях тестирования, исправления ошибок
// методом полного обновления и при первоначальном создании структуры
exercises._restruct = function _restruct(){
	mongo.then(res => res.collection(collectionName))
		.then(	
				res => {
					res.drop() 
					console.log(collectionName+" droped")
				},
				err => {console.log(err)})
	
	mongo.then(res => {
		res.createCollection(collectionName,
			{
				capped : true,
				max    : 200
			}
		)
	})
}

module.exports = exercises;