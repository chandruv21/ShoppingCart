var mongoose = require('mongoose');

//New Area Map Schema

var newAreaSchema = mongoose.Schema({
	username:
	{
		type: String
	},
	mobile: 
	{
		type: Number
	},
	lat: {
		type: String,
		required: true
	},
	lng: {
		type: String,
		requires: true
	}

});

var NewArea = module.exports = mongoose.model("NewArea", newAreaSchema);
