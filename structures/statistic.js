//5.04.2018 Lewiczkij M
/**
* Функционал, связанный с сохранением в базы и извлечением статистики
* Строка данных статистики выглядит так:
* {	
*	"time"  : 1483083098626,
*	"str"   : "53 + x = 86 7",
*	"right" : false,
*	"uid"   : "5ac68a2d9d23550fa0239027",
*	"eid"   : "5ac55be7bf2de213c47ffa96"
* }
* uid - ид пользователя 
* eid - ид упражнения
*/

var mongo = require("./mongo")
var until = require("./until")

// Название mongodb коллекции
var collectionName = "statistic";

var statistic = {}

statistic.add = function add(data){
	if(data.uid == undefined || data.eid == undefined)
		return Promise.reject(TypeError("Chunk don`t have uid and eid!"))
	try{
		until.getMongoObjectId(data.uid)
		until.getMongoObjectId(data.eid)
	} catch(err){ return Promise.reject(TypeError("Invalid uid or eid!"))}
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.insert(data))
}

// Получение статистики в виде набора документов.
// Отбор происходит по идентификаторам uid и eid: 
// {uid: [uid1, uid2, ...], eid:[eid1,eid2, ...] }
// При отсутствии идентификаторов, возвращает весь набор 
statistic.get = function get(ids){
	// Формирование правильного фильтра
	var filter = {}
	if(ids.uid != undefined && ids.uid != "*") {
		var myUid;
		if(ids.uid.length == undefined) myUid = ids.uid;
		if(ids.uid.length == 1)         myUid = ids.uid[0];
		if(ids.uid.length >  1)         myUid = ids.uid;
		filter.uid = myUid;
	}
	
	if(ids.eid != undefined && ids.eid != "*") {
		var myEid;
		if(ids.eid.length == undefined) myEid = ids.eid;
		if(ids.eid.length == 1)         myEid = ids.eid[0];
		if(ids.eid.length >  1)         myEid = ids.eid;
		filter.eid = myEid;
	}
	return mongo.then(res => res.collection(collectionName)).
	then(res => res.find(filter)).
	then(res => res.toArray())
}

statistic._restruct = function _restruct(){
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
				max    : 100000,
				size   : 52428800
			}
		)
	})
}

module.exports = statistic;