var mongoose = require('mongoose');

//Product Schema

var ProductSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
	},
	desc: {
		type: String,
		required: true
	    },
	kg: {
		type: String,
	},
	subcategory: {
		type: String,
        	required: true
	},
    category: {
		type: String,
		required: true
	},
	price: {
        type: Number,
        required: true
    },
	dummyprice: {
		type: Number,
	},
    image: {
		type: String,
	},
    sorting: {
 		type: Number,
	   }

});

var Product = module.exports = mongoose.model('Product', ProductSchema);
