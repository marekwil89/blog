var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');   
var Article = mongoose.model('Article');
var valid = require('./validation.js');
var multer  = require('multer')
var async = require('async')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + '.jpg');
  }
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
	Article.find({}, function(err, articles){
		if(err){
			console.log(err)
		}
		return res.render('articles', {articles: articles});
	})
});

// router.get('/detail/:id', function(req, res, next) {
// 	var id = req.params.id
// 	Article.findById({_id: id}, function(err, article){
// 		if(err){
// 			console.log(err)
// 		}
// 		return res.render('article', {article: article})
// 	})
// });

router.get('/detail/:id', function(req, res, next) {
    async.parallel([
    function(next) {
    	var id = req.params.id
       	Article.findById({_id: id}, function(err, article){
			if(err){
				console.log(err)
			}
			next(null, article);
		})
    },
    function(next) {
        Article.find({}).sort('-created').limit(3).exec(function(err, newests){
			if(err){
				console.log(err)
			}
            next(null, newests);
        });
    }], function(err, results) {
        res.render('article', {article: results[0], newests: results[1]});
    });
});

router.get('/new', function(req, res, next) {
	res.render('article-new');
});

router.post('/new', valid.isAuth, upload.single('background'), valid.newArticle,  function(req, res, next) {

	newArticle = new Article();

	newArticle.author = req.user.username;
	newArticle.title = req.body.title;
	newArticle.categories = req.body.categories;
	newArticle.descr = req.body.descr;
	newArticle.imageName = req.file.filename;

	console.log(newArticle)

	newArticle.save(function(err, newArticle) {
		if (err){
			console.log(err); 
		}
		return res.render('article', {article: newArticle})
	});		


});

router.get('/edit/:id', function(req, res, next) {
	var id = req.params.id
	Article.findById({_id: id}, function(err, editArticle){
		if(err){
			console.log(err)
		}

		return res.render('article-edit', {article: editArticle})
	})
});

router.post('/edit/:id', valid.isAuth, upload.single('background'), valid.editArticle, function(req, res, next) {
	var id = req.params.id
	Article.findById({_id: id}, function(err, editArticle){
		editArticle.descr = req.body.descr;
		editArticle.title = req.body.title;
		editArticle.author = req.user.username;
		editArticle.categories = req.body.categories;

		editArticle.save(function(err, editArticle) {
			if (err){
				console.log(err);
			}
			return res.render('article', {article: editArticle})
		});		
	})

});


router.post('/detail/:id/newComment', valid.isAuth, valid.newComment ,function(req, res, next) {
	var id = req.params.id
	Article.findById({_id: id}, function(err, article){
		var comment = {
			text: req.body.text,
			author: req.user.username
		}
		article.comments.push(comment)

		console.log(article.comments)

		// article.save(function(err, aritcle){
		// 	if(err){
		// 		console.log(err)
		// 	}
		// 	return res.render('article', {article: article})
		// })
	})
});

module.exports = router;