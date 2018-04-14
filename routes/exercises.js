var express = require('express');
var router  = express.Router();
var exercises   = require('../structures/exercises');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// get
router.get('/get/:id', function(req, res, next) {
	exercises.getbyId(req.params.id).
	then(list => res.send(list),
		err => res.status(500).send({error:{name:err.name,message:err.message}}));
});

router.get('/get', function(req, res, next) {
	exercises.getAll().
	then(list => res.send(list),err => next(err))
});
// del

router.get('/del/:id', function(req, res, next) {
	exercises.del(req.params.id).
	then(eRes => res.send(eRes),
		err => res.status(500).send({error:{name:err.name,message:err.message}}));
});

/**
* direct
* Для успешной передачи набор данных на клиенте в jquery.ajax должен иметь вид: 
* {directs:["2355","36236264","356787"]}
* Иначе данные будут переданы неправильно
*/
router.post('/direct/:id', function(req, res, next) {
	var data = req.body.directs;
	console.log(req.body)
	exercises.direct(req.params.id,data).
	then(eRes => res.send(eRes),
		err => {
			res.status(500).send({error:{name:err.name,message:err.message}})}
		);
});

// add
router.post('/add', function(req, res, next) {
	var data = req.body;
	exercises.add(data).
	then(eRes => res.send(eRes),
		err => res.status(500).send({error:{name:err.name,message:err.message}}));
});

// Вспомогательная функция, загрузки из файлов
router.get('/add/files', function(req, res, next) {
	var out = ""
	var fs = require("fs");
	var path = "data/";
	for (var i = 0; i < 15; i++) {
		var key = "menu_" + i;
		var data = JSON.parse(fs.readFileSync(path + key).toString());
		exercises.add(data).catch(err =>console.log(err))
	};
	res.send(out)
})



module.exports = router;