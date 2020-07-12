var mongoose = require('mongoose');

//Category Schema

var SubCategorySchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
	}

});

var SubCategory = module.exports = mongoose.model('SubCategory', SubCategorySchema);
