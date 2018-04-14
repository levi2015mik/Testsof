/**
* Объект пользователя 
*/
function User(name,description,id){
	this.name = name;
	this.description = description;
	if(id == undefined)
		this.createNew();
	else{ 
		this.id = id;
		this.addToTable();
	}
}

/******************
* Методы объекта
*/
/**
* Сохранение на сервере вновь созданного пользователя и присвоение ему id
*/
User.prototype.createNew = function createNew(){
	var self = this;
	var data = {name:this.name, description:this.description};
	$.ajax("/users/add",{
		type:"post",
		contentType:"application/json",
		data:JSON.stingify(data),
		success: function(result) {
			for(var nm in result){
    			if(!result.hasOwnProperty(nm)) continue;

    			// Проверка корректности имен (согласование _id из базы с id объекта)
    			// Плохое решение, может потом исправлю все id в User
    			if(nm == "_id") self["id"] = result[nm];
    			else self[nm] = result[nm];
    		}

			self.addToTable();
			User.table.onCreate(self);
		},
		error:until.ajaxError });
}

/**
* Добавление информации о пользователе в таблицу.
* Этот метод работает и берет свои настройки из статического свойства User.table
*/
User.prototype.addToTable = function addToTable(){
	if(User.table == undefined) return;

	var tr = $("<tr></tr>")
	tr.html(User.table.tr)
	this.tr = tr;

	// Привязка обработчиков нажатия
	var links = $(this.tr).find("[data-link]")
	for (var i = 0; i < links.length; i++) {
		var self = this;

		// Неочевидный хак с самозапускающейся функцией создает ространство имен,
		// привязывающий переменную attr к циклу линков и его конкретной итерации 
		(function() {
			var attr = $(links[i]).attr("data-link");			
			var ev =User.table.links[attr]
			$(links[i]).click(function(){ev(self)})
		})();
	};

	// Редактирование ссылок
	var hrefs = $(this.tr).find("[data-href]")
	for (var i = 0; i < hrefs.length; i++) {
		var str = "?UID=" + this.id + "&EID=*";
		hrefs[i].href += str;
	}

	// Привязка контента
	var contents = $(this.tr).find("[data-content]")
	for (var i = 0; i < contents.length; i++) {
		var attr = $(contents[i]).attr("data-content");
		if(this[attr] != undefined)
			contents[i].append(this[attr])
	};

	//TODO Сделать привязку чекбоксов к объекту User
	/**
	* Свойство checkboxes содержит именованный список DOM елементов input type=checkbox
	* При необходимости проверить или изменить чекбоксы, следует обращаться непосредственно к DOM 
	* Это не Angular! 
	*/
	this.checkboxes = {};
	var checkboxes = $(this.tr).find("[data-checkbox]")
	for (var i = 0; i < checkboxes.length; i++){
		var attr = $(checkboxes[i]).attr("data-checkbox")
		this.checkboxes[attr] = checkboxes[i]; 
	}

	User.table.element.append(this.tr)
}

/**
* Удаление выбранного пользователя из базы и информацию о нем из таблицы
*/
User.prototype.del = function del(){
	var path = "/users/del/" + this.id;
	var self = this;
	$.ajax(path,{type:"get",
		success:function(result) {
			if(result != true) return;

			if(self.tr != undefined){ 
				$(self.tr).remove();
				delete self.tr
			}
			until.popUp("Is deleted")
		},
		error:until.ajaxError});
}

/******************
* Статические методы и свойства
*/

/**
* Загрузка списка пользователей и создание объектов User
*/
User.load = function load(){

	function createObjs(data) {
	 	for (var i = 0; i < data.length; i++) {
	 		
	 		var newUsr = new User(data[i].name, 
	 			data[i].description,
	 			data[i]._id);

	 		User.collection.push(newUsr);
	 	};
	 } 
	$.ajax("/users/list",
		{
			type:"get",
			success: createObjs,
			error: until.ajaxError});
}

User.readCheckboxes = function readCheckboxes (name) {
	var out = [];
	for (var i = 0; i < User.collection.length; i++) {
		var el = User.collection[i].checkboxes[name];
		if(el == undefined) continue;
		var val = el.checked;
		if(val) out.push(User.collection[i].id)

	};
	return out;
}
User.setCheckboxes = function setCheckboxes (name,ids) {
	if(ids == undefined) return;
	for (var i = 0; i < User.collection.length; i++){
		var el = User.collection[i].checkboxes[name];
		if(el == undefined) continue;
		if(ids.indexOf(User.collection[i].id) != -1)
			el.checked = true;
	}
}
User.resetCheckboxes = function resetCheckboxes (name) {
	for (var i = 0; i < User.collection.length; i++) {
		var el = User.collection[i].checkboxes[name];
		if(el == undefined) continue;
		el.checked = false;
	};
}

User.collection = [];