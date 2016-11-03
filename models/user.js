var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	username: {type: String, default: ''},
	password: {type: String},
	repeatPass: {type: String},
	created: {type: Date, default: Date.now},
	admin: {type: Boolean, default: false}
})

mongoose.model('User', userSchema);