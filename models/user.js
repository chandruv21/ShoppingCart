var mongoose = require('mongoose');

//User Schema

var UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
//	email: {
//		type: String,
//	},
	username: {
		type: Number,
		required: true
        },
       password: {
		type: Number,
	},
	admin: {
		type: Number,
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
