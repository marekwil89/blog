var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new mongoose.Schema({
	author: {type: String},
	title: {type: String},
	categories: {type: Array},
	descr: {type: String},
	created: {type: Date, default: Date.now},
	updated: {type: Date, default: Date.now},
	imageName: {type: String},
	comments: [{
		author: {type: String},
		text: {type: String},
		created: {type: Date, default: Date.now}
	}]
})

mongoose.model('Article', articleSchema);