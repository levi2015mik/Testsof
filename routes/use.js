var express   = require('express');
var router    = express.Router();
var users     = require('../structures/users');
var exercises = require('../structures/exercises');
var statistic = require('../structures/statistic');
/**
* Пользовательский набор запросов 
*/

// Первый и главный запрос пользователя: 
router.get('/:uid', function(req, res, next) {
	Promise.all([
		users.login(req.params.uid),
		exercises.getOfUser(req.params.uid),
		exercises.getOfUser("5acb3b739bd4ef146405feaf")    // TODO refactor Магическое число означает общего пользователя.
		]).
	then(
		data => res.send({
			"user"	   : data[0],
			"personal" : data[1],
			"common"   : data[2]
		}),
		err => res.status(500).send({error:{name:err.name,message:err.message}}));
});

router.get('/:uid/:eid', function(req, res, next) {
	Promise.all([
		users.login(req.params.uid),
		exercises.getbyId(req.params.eid)
	]).
	then(data => res.send(data[1]),
		err => res.status(500).send({error:{name:err.name,message:err.message}}));
})


router.post('/statistic/:uid', function(req, res, next) {
	if(req.params.uid != req.body.uid)
		res.status(500).send({error:{name:"TypeError".name,message:"Uncorrect data of statistic"}})
	Promise.all([
		users.login(req.params.uid),
		statistic.add(req.body)]).
	then( data => res.send(true),
		  err  => res.status(500).send({error:{name:err.name,message:err.message}}));
})


router.get('/statistic/:uid/:eid', function(req, res, next) {
	statistic.get({
		uid:req.params.uid,
		eid:req.params.eid
	}).

	then(data => res.send(data)).
	catch(err => res.status(500).send({error:{name:err.name,message:err.message}}))

});

module.exports = router;
