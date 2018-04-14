//4.04.2018 Lewiczkij M
// Функционал, связанный с генерацией, авторизацией и редактированием пользователей
/**
* В приложении не предусмотрена регистрация пользователей и их авторизация
* Для манипуляций используются уникальные коды _id Они и являются главным учетным элементом.
* Авторизация, на самом деле, не более чем проверка по базе, существует ли пользователь.
* Это будет происходить при каждом новом обращении к серверу от имени пользователя 
*/

var mongo = require("./mongo")
var until = require("./until")

// Название mongodb коллекции
var collectionName = "users";

var users = {};

// Добавление нового пользователя, принимает личные данные, возвращает код uid
users.add = function add(user){
	if(user.name == undefined || user.description == undefined)
		return Promise.reject(TypeError("User`s data is uncomplite!"))
	
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.insertOne(user)).
	then(res => {return res.ops[0]})
}

// Проверка существования пользователя в системе. Возвращает объект пользователя 
// или ошибку отсутствия такового в базе
// TODO Вставка в базу информации и времени входа и выдача данных с временем последнего посещения через проекцию
users.login = function login(uid){
	try{ var id = until.getMongoObjectId(uid)}
	catch(err){
		return Promise.reject(TypeError("User`s ID is uncorrect!"))
	}
	
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.findOne({"_id":id}) ).
	then(res => {
		if(res == null) return Promise.reject(Error("User not found"))
		else return res;
	})
	
}

// Удаление пользователя
users.del = function del(uid){
		try{ var id = until.getMongoObjectId(uid)}
	catch(err){
		return Promise.reject(TypeError("User`s ID is uncorrect!"))
	}
	
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.deleteOne({"_id":id})).
	then(res => {
		if(res.result.n == 1) return true;
		else return Promise.reject(Error("Deleted user not found"));
	})
}

// Добавление и изменение данных. Эта функция, возможно, 
// пригодится впоследствии для добавления новых свойств пользователям, например аналитики по учебе
// TODO Not support
users.update = function update(uid){}

// Вывод списка пользователей. 
// Список передается сразу и целиком, так как на первом этапе его 
// размер вряд ли превысит несколько десятков человек.
users.list = function list(){
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.find({})).
	then(res => res.toArray())
}

// Удаление коллекции пользователей и создание новой с заданной структурой
// Эта операция производитсяв целях тестирования, исправления ошибок
// методом полного обновления и при первоначальном создании структуры
users._restruct = function _restruct(){
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
	});
	
}


// Вспомогательные функции

module.exports = users;