var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');   
var User = mongoose.model('User');
var valid = require('./validation.js');



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//LOGIN
router.get('/login', function(req, res, next) {
	res.render('login')
});

passport.use('login', new LocalStrategy(
	function(username, password, done) { 
		User.findOne({ 'username' :  username }, function(err, user, req) {
			if (!user || !valid.isValidPassword(user, password)){
				console.log('Invalid password or username')
				return done(null, false, {message: 'Invalid password or username'});                 
			}
			console.log(username + ' is loged in')
			return done(null, user);
		});
	}
));

router.post('/login', valid.login , 
  passport.authenticate('login', { 
  	successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}));


//REGISTER




router.get('/register', function(req, res, next) {	
	res.render('register', req.flash('error'))
});

passport.use('register', new LocalStrategy(
	function(username, password, done) {
		User.findOne({ 'username' :  username }, function(err, user, req) {
			if (user) {
				console.log('This username is already taken')
				return done(null, false, {message: 'This username is already taken'});
			} 
			// var newUser = new User();

			// newUser.username = username;
			// newUser.password = valid.createHash(password);

			// newUser.save(function(err) {
			// 	if (err){
			// 		console.log(err); 
			// 		return done(err);
			// 	}
			// 	console.log(newUser.username + ' Registration succesful');    
			// 	return done(null, newUser);
			// });
		});
	})
);

router.post('/register', valid.register, 
  passport.authenticate('register', { 
  	successRedirect: '/',
    failureRedirect: '/users/register',
    failureFlash: true
}));

//LOGOUT

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
