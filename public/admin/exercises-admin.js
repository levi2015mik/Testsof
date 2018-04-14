/**
* Схема данных для Exercises
*/
function Exercise(proto) {
		if(proto.menuname == undefined) {
		throw new TypeError("Data of exercise is uncorrect! It hasn`t name");
		return;
	}
	for(var nm in proto){
		if(!proto.hasOwnProperty(nm)) continue;
		this[nm] = proto[nm]
	}
	this.addToTable();
}

Exercise.prototype.addToTable = function addToTable () {
	if(Exercise.table == undefined) return;
	var tr = $("<tr></tr>")
	tr.html(Exercise.table.tr)
	this.tr = tr;

	// Привязка контента
	var contents = $(this.tr).find("[data-content]")
	for (var i = 0; i < contents.length; i++) {
		var attr = $(contents[i]).attr("data-content");
		if(this[attr] != undefined)
			contents[i].append(this[attr].value)
	};
	Exercise.table.element.append(this.tr)

	// Редактирование ссылок
	var hrefs = $(this.tr).find("[data-href]")
	for (var i = 0; i < hrefs.length; i++) {
		console.log(this)
		var str = "?EID=" + this._id + "&UID=*"
		hrefs[i].href += str
	};

	// Привязка обработчиков нажатия
	var links = $(this.tr).find("[data-link]")
	for (var i = 0; i < links.length; i++) {
		var self = this;

		// Неочевидный хак с самозапускающейся функцией создает ространство имен,
		// привязывающий переменную attr к циклу линков и его конкретной итерации 
		(function() {
			var attr = $(links[i]).attr("data-link");			
			var ev =Exercise.table.links[attr]
			$(links[i]).click(function(){ev(self)})
		})();
	};
}

Exercise.prototype.del = function del () {
	var path = "/exercises/del/" + this._id;
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

Exercise.prototype.setDirect = function setDirects (directs) {
	var path = "/exercises/direct/" + this._id
	var data = {directs:directs}
	$.ajax(path,
	{
		type:"post",
		data:data,
		success: function() {
			until.popUp("Данные записаны")
		},
		error: until.ajaxError
	});
}

Exercise.load = function load (uid) {
	var path = "/exercises/get"
	if(uid != undefined) path + "/" + uid

	function createObjs(data) {
 		for (var i = 0; i < data.length; i++) {
 			
 			var newEx = new Exercise(data[i]);
 			Exercise.collection.push(newEx);
 		};
 	}

	$.ajax(path,
	{
		type:"get",
		success: createObjs,
		error: until.ajaxError
	});
}

Exercise.collection = [];