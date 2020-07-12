var mongoose = require('mongoose');

//Map Schema

var searchSchema = mongoose.Schema({
	user: String,
	searchedItem: String
});

var Search = module.exports = mongoose.model("Search", searchSchema);

