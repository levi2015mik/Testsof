/**
* Утилиты, несущие вспомогательные функции
*/

var until = {}
// Всплывающее сообщение
until.popUp = function popUp(content,time){
	var vin = $("<div></div>")
	vin.css({
		"border-bottom": "solid 2px #CC0000",
		background: "#FFFFCC",
		position:   "absolute",
		width:      "100%",
		height:     45, 
		top:        0,
		left: 		0 
	})
	var cont = $("<div></div>")
	cont.css({
	"font-size":  "125%",
	padding:      "10px 30px"
	})
	vin.append(cont);
	cont.html(content);
	$(document.body).append(vin)
	if(typeof time != "number")
		var time = 2000;
	setInterval(function() {vin.remove()},time)
}

until.ajaxError = function ajaxError(err) {
	switch(err.status){
		case 0: 
			until.popUp("Нет соединения! Повторите попытку позже"); 
			break;
		case 404: 
			until.popUp("Ошибка 404") 
			break;
		case 500: 
			until.popUp(err.responseJSON.error.message);
			break;
	}			
	console.log(err)
}