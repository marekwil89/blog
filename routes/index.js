var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('user is '+ req.user)
	if (req.session.views) {
	    req.session.views++
	    console.log(req.session.views)
	  } else {
	    req.session.views = 1
	  }
	res.render('index');
});

module.exports = router;
