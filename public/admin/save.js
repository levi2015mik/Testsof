//Объект сохранения настроек в localStorage
//Позднее будут другие разновидности этой библиотеки более пригодные для конкретной рабочей среды
//такой как web или android
// будущем предполагается режим посылки на сервер в виде асинхронного JSON 
save = {};

//Сохранение задангного объекта под заданным именем в localStorage
save.objToStorage = function(obj,name) {
	try {
		var json = JSON.stringify(obj);
	} catch (err) {
		alert("Невозможно преобразовать объект");
		return;
	}
	try {
		localStorage[name] = json;
	} catch (err) {
		alert("Браузер не поддерживает localStorage сохранение невозможно");
		return err;
	}
	return json;
};

//
save.loadFromJson = function(name){
	try{
		var data = localStorage[name];
		var obj;
		obj = JSON.parse(data);
		return obj;
	} catch (err) {
		return false;
	}
};
save.config = {};
//Содержит значение, говорящее о методе сохранения.
//0: только в объект config.conf, 1: в config.conf и localStorage.conf, 
//2: в config.conf localStorage.conf и в главное меню (localStorage.nav?)

//Сохранение настроек в localStorage
save.config.saveLs =function(){
	config.save();
	save.objToStorage(config.conf,"conf");
};

//Сохранение блока настроек для объекта меню
save.config.saveToMenu = function() {
	config.conf.menuname.value = prompt("Введите пункт меню");
	config.conf.menuname.hidden = true;
	config.save();
	save.lsGroups.write("menu",config.conf)
};

//Методы работы с группами из localStorage вида name_index
save.lsGroups = {};

save.lsGroups.collection = [];
//Реализует чтение данных. принимает name и необязательный набор индексов. Возвращает массив значений
save.lsGroups.read = function(name) {
	try {
		var i = 0;
		for(var count in localStorage) {
			if(!localStorage.hasOwnProperty(count)) {
				continue;
			}
			var arr;
			arr = count.split("_");
			if(arr.length == 1){
				continue;
			}
			if(arr[0] == name) {
				save.lsGroups.collection[i] = save.loadFromJson(count);
				i++;
			}
		}
		return save.lsGroups.collection;
	} catch(err) {
		return err;
	}
};

//Сохраняет value в localStorage с именем вида name_index
//сохранение происходит под следующим после последнего номером
save.lsGroups.write = function(name,value){
	save.lsGroups.read(name);
	//Внутренняя функция для записи в localStorage всего набора параметров из массива
	function writeAll(){
		try {
			for(var i = 0; i<save.lsGroups.collection.length; i++){
				save.objToStorage(save.lsGroups.collection[i],name + "_" + i);
			}
		} catch (err) {
			return err;
		}
	}
	if(typeof value == "undefined") {
		writeAll();
		return;
	}
	try {
		var count = save.lsGroups.collection.length;
		save.lsGroups.collection.push(value);
		save.objToStorage(value,name + "_" + count);
	} catch(err) {
		return err;
	}
};

//Удаление всей группы или одного элемента
//Для удаления всего списка num = "*"
save.lsGroups.del = function(name, num){
	//Удаление всего массива для удобства выносится в новую функцию
	function delAll() {
		for (var count in localStorage) {
			if (!localStorage.hasOwnProperty(count)) {
				continue;
			}
			var arr = count.split("_");
			if (arr.length == 1) {
				continue;
			}
			if (arr[0] == name) {
				delete localStorage[count];
				i++;
			}
		}
	}
	try {
		var i = 0;
		if(num =="*") {
			delAll();
			return;
		}
		//Удаление одного элемента
		//Нужно предусмотреть возможность удаления массива.
		//Для этого проверка на тип входящих
		if(typeof(num) == "number") { 
			save.lsGroups.collection.splice(num,1);
			delAll();
			save.lsGroups.write(name);
		} else {			
			var bufer = [];
			for(var i = 0;i < save.lsGroups.collection.length;i++ ) {
				var key = false;  
				for(var j = 0;j < num.length;j ++) 
					if(parseInt(num[j]) == i) key = true;  
				if(!key) 
					bufer[bufer.length] = save.lsGroups.collection[i];
				key = false;
			}
			save.lsGroups.collection = bufer;
			delAll();
			save.lsGroups.write(name);

		}
	} catch (err) {
		return err;
	}
};





save.location = {};



/******
* Отсюда начинается новая часть, непосредственного обращения
* Взаимодействие с сервером будет происходить через узкоспециализированные 
* узкоспециализированные функции.
* 
* # Вот основные из них
* - Загрузка персонального и общего списка заданий get /use/[userID]
* - Сохранение выбранного списка заданий в sessionStorage
* - Отправка статистики на сервер post /use/[userID]/statistic
* - Получение персональной статистики get /use/[userID]/statistic/([exerciseID])
*
* # Дополнительные функции, только для администратора (в отдельной версии)
* - Сохранение новых упражнений post http://127.0.0.1:3000/exercises/add
* - статистика по пользователю и упражнению post http://127.0.0.1:3000/statistic/[userID] | * /[exerciseID] | *
*
* # Вспомогательные функции
* - Взятие идентификатора пользователя из адресной строки ?[userID]
* - Добавление идентификатора пользователя к каждой ссылке в документе
*/

// Взятие идентификатора пользователя из адресной строки ?[userID]
save.getUIDfromLoc = function getUIDfromLoc () {
	try{
		var data = location.href.split("?")[1].split("&");
	} catch(err){
		return;
	}
	for (var i = 0; i < data.length; i++) {
		if(data[i] == "") continue;
		var kv = data[i].split("=");
		save.location[kv[0]] = kv[1]
	};
}

// Добавление идентификатора пользователя к каждой ссылке в документе
save.renewLinksWithUID = function renewLinksWithUID () {
	save.location
	var dataline = "?";
    for(name in save.location){
        dataline += name + "=" + save.location[name] + "&"
    }

	$("a").each((index,element)=>{
		if(element.href.split("?").length != 1) return
		element.href += dataline;
	})
}

// Загрузка данных с сервера
save.load = function load (callback) {
	var path = "/use/" + save.location.UID
	$.ajax(path,{
		type:"get",
		success: function(result) {callback(result)},
		error: until.ajaxError
	})
}

// Загрузка данных об одном упражнении по данным save.location.EID
save.loadOne = function loadOne (callback) {
	if(save.location.EID == undefined) {
		callback();
		return;
	}
	var path = "/exercises/get/" + save.location.EID;
	$.ajax(path,{
		type:"get",
		success: function(result) {
			config.conf = result[0];
			callback();
		},
		error: until.ajaxError
	})
}

// Создание нового упражнения
save.addExercise = function() {
	config.conf.menuname.value = prompt("Введите пункт меню");
	config.conf.menuname.hidden = true;
	config.save();
	// Отправка на сервер config.conf
	var path = "/exercises/add/"
	$.ajax(path,{
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(config.conf),
		success: function() {until.popUp("Создано новое упражнение")},
		error: until.ajaxError
	})
};

// Отправка на сервер статистики 
save.statUpload = function statUpload(element){
	var path = "/use/statistic/" + save.location.UID;
	$.ajax(path,{
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(element),
		success: function(result) {console.log(result)},
		error: until.ajaxError
	})
}

// Загрузка статистики с сервера
save.loadStatistic = function loadStatistic (callback,eid) {
	if(save.location.UID == undefined)
		save.location.UID = "*";
	if(save.location.EID == undefined)
		save.location.EID = "*";
	var path = "/use/statistic/" + save.location.UID;
	if(eid != undefined) path += "/" + eid;
	else 
		path += "/" + save.location.EID
	//
	$.ajax(path,{
		type:"get",
		success:callback,
		error:until.ajaxError
	})
}