var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var fs = require('fs');

module.exports = {

	isValidPassword : function(user, password){
		return bCrypt.compareSync(password, user.password);
	},

	createHash : function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	},

	login: function(req, res, next){
		var username = req.body.username;
		var password = req.body.password;

		req.checkBody('username', 'Name is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();

		var errors = req.validationErrors();
		console.log(errors)
		if(errors){
			return res.render('login', {errors: errors})
		}
		next()
	},

	register: function(req, res, next){
		var username = req.body.username;
		var password = req.body.password;
		var repeatPass = req.body.repeatPass;
		req.checkBody('username', 'Name is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('repeatPass', 'Password is required').notEmpty();
		req.checkBody('password','Passwords do not match.').equals(repeatPass);

		var errors = req.validationErrors();

		if(errors){

			return res.render('register', {errors: errors})
		}
		next()
	},

	isAuth: function(req, res, next){
		if(!req.isAuthenticated()){

			req.flash('errors', {msg : 'You must be logged'})
			return res.redirect(req.header('referer'));
		}
		next()
	},

	newComment: function(req, res, next){
		var text = req.body.text

		req.checkBody('text', 'text is required').notEmpty();
		var errors = req.validationErrors();
		console.log(errors)
		if(errors){
			req.flash('errors', errors)
			return res.redirect(req.header('referer'));			
		}
		next()
	},

	newArticle: function(req, res, next){
		var title = req.body.title
		var descr = req.body.descr
		var categories = req.body.categories

		req.checkBody('descr', 'description is required').notEmpty();
		req.checkBody('categories', 'categories is required').notEmpty();
		req.checkBody('title', 'title is required').notEmpty();
		var errors = req.validationErrors();
		console.log('errors ' + errors)
		if(errors){
			fs.unlink(req.file.destination + req.file.filename)
			return res.render('article-new', {errors: errors});
		}
		next()
	},

	editArticle: function(req, res, next){
		var title = req.body.title
		var descr = req.body.descr
		var categories = req.body.categories

		req.checkBody('descr', 'description is required').notEmpty();
		req.checkBody('categories', 'categories is required').notEmpty();
		req.checkBody('title', 'title is required').notEmpty();
		var errors = req.validationErrors();
		console.log('errors ' + errors)
		if(errors){
			return res.render('article-edit', {errors: errors});
		}
		next()
	},

}