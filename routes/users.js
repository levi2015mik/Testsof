var express = require('express');
var router  = express.Router();
var users   = require('../structures/users');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Запрос списка пользователей
router.get('/list',function(req, res, next){
	users.list().
	then(
		ulist => res.send(ulist),
		err   => next(err));
});

router.get('/login/:id',function(req, res, next){
	users.login(req.params.id).
	then(
		ulist => res.send(ulist),
		err   => res.status(500).send({error:{name:err.name,message:err.message}}));
});


router.get('/del/:id',function(req, res, next){
	users.del(req.params.id).
	then(
		uRes => res.send(uRes),
		err   => res.status(500).send({error:{name:err.name,message:err.message}}));
});

router.post('/add',function(req, res, next){
	var data = req.body;
	users.add(data).
	then(
		uNew => res.send(uNew),
		err   => res.status(500).send({error:{name:err.name,message:err.message}}));
});

module.exports = router;
