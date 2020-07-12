var mongoose = require('mongoose');
var User = require('./user.js');

//Map Schema

var locationSchema = mongoose.Schema({
	user:
	{
		type: Number
	//	ref: 'User'
	},
	lat: {
		type: String,
//		required: true
	},
	lng: {
		type: String,
//		requires: true
	}

});

var Location = module.exports = mongoose.model("Location", locationSchema);
