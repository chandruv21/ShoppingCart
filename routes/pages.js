var express = require('express');
var router  = express.Router();

//Get Page Model
var Page = require('../models/page');	 
//Get Product Model
var Product = require('../models/product');

// Get  / 
router.get('/',function(req,res){
	// {title: MahadevaMart } sending to index.ejs as well as layouts directory. 
	// title is called in header.ejs file.
	var slug = req.params.slug;
//	Page.findOne({slug: 'home'}, function(err, page){
//		if(err)
//		console.log(err);
//		//	res.render('index', {
//			res.render('all_products', {
//				titleVar: page.title,
//				contentVar: page.content
//			});
//		
//	});
	// res.render("index", { title: 'MahadevaMart'});
//	Product.find({}, function (err, products) {
	Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, products) {
			if (err)
				console.log(err);
			res.render('all_products', {
				titleVar: 'All products',
				productsVar: products
			});
		});

});


// Get a page
router.get('/:slug',function(req,res){

	var slug = req.params.slug;
	Page.findOne({slug: slug}, function(err, page){
		if(err)
		console.log(err);
		
		if(!page) {
			res.redirect('/');
		} else {
			res.render('index', {
				titleVar: page.title,
				contentVar: page.content
			});
		}
	});
	// res.render("index", { title: 'MahadevaMart'});
});


//Exports
module.exports = router;
