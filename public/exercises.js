/**
* Схема данных для Exercises
*/
function Exercise(proto,elementDom) {
		if(proto.menuname == undefined) {
		throw new TypeError("Data of exercise is uncorrect! It hasn`t name");
		return;
	}
	for(var nm in proto){
		if(!proto.hasOwnProperty(nm)) continue;
		this[nm] = proto[nm]
	}
	this.elementDom = elementDom;
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
			$(contents[i]).append(this[attr].value)
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

	// Редактирование ссылок
	var hrefs = $(this.tr).find("[data-href]")
	for (var i = 0; i < hrefs.length; i++) {
		var str = "?UID=" + save.location.UID + "&EID=" + this._id;
		hrefs[i].href += str;
	}


	this.elementDom.append(this.tr);
}

// Загрузка данных из сети осуществляется через save.js 
// Exercise.load просто создает коллекции элементов, запуская 
// тем самым цепочку генерации.
Exercise.load = function load(data,collectionLink,elementDom){ 		
	for (var i = 0; i < data.length; i++) {		
		var newEx = new Exercise(data[i],elementDom);
		collectionLink.push(newEx);
	};
}