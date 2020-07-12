var express = require('express');
var router  = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//Get Category Model
var Category = require('../models/category');	 


// Get Category index route
// Complete path is /admin/categories
router.get('/', isAdmin ,function(req,res){
	//Fetching data from the database 
		Category.find({},function(err,categories){
			if(err){
				return console.log("There is error in /admin/category Get Route", err);
			}
		res.render('admin/categories',{categoriesVar: categories});
	});
});

// Get add Page
// Complete path is /admin/pages/add-category
router.get('/add-category', isAdmin ,function(req,res){
	var title = "";
	res.render('admin/add-category',{
		titleVar : title,
	});
});

// Complete path is /admin/categories/add-category
//Post request from the form.
router.post('/add-category', function(req,res){
	// Validating title
	// title should not be empty becasue 
	// we defined in the file models/category.js as title  "required: true"

	// req.checkBody(field[, message])
	   req.checkBody('title' ,"Title can't be Empty").notEmpty();

	// Fetched Data from the form.
	   var title = req.body.title;
	   //slug is lowercase of title.
  	   slug=title.replace(' ','-').toLowerCase();

		errors = req.validationErrors();

		// console.log(errors);
		if(errors){
		res.render('admin/add-category',{
			errors : errors,
			titleVar : title,
	  		 });  
	   } else {
		   //Slug should be unique so adding below line
		   Category.findOne({ slug: slug}, function(err, category){
			   console.log(slug);
			   if(category){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'Category title exists, choose another');
				   console.log('choose another');
					res.render('admin/add-category',{
						titleVar : title
						}); 
			   } else {
				   var  category = new Category({
					   title: title,
					   slug: slug
				   });
				   category.save(function (err){
					if(err) return console.log("Error in /admin/categories/add-category Post Route", err);
					Category.find(function (err, categories) {
						if (err) {
						  console.log("Error in the app.js file Category.find()", err);
						} else {
						  req.app.locals.categories = categories;
						}
					  });
					// success is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by success.
					req.flash('success', 'Category added!!!');
					console.log('Category added!!');
					res.redirect('/admin/categories');
				   });
			   }
		   });
	   }
	});

// Get edit Category
// Complete path is /admin/categories/edit-category/:id
router.get('/edit-category/:id',isAdmin,function(req,res){
	Category.findById(req.params.id, function(err, category) {
		if(err){
			return console.log("Error in /admin/categories/edit-category/:id", err);
		}
		res.render('admin/edit-category',{
			titleVar : category.title,
			idVar	 : category._id
		});
	});
});
	



// Post Edit Category
// Complete path is /admin/categories/edit-category/:id
//Post request from the form to edit-page/:slug
router.post('/edit-category/:id',function(req,res){
	// Validating title variables
	// title should not be empty becasue 
	// we defined in the file models/category.js as title "required: true"

	// req.checkBody(field[, message])
	   req.checkBody('title' ,"Title can't be Empty").notEmpty();

	// Fetched Data from the form.
	   var title = req.body.title;
	   //slug is lowercase of title.
		slug=title.replace(' ','-').toLowerCase();
	    var id = req.params.id;

		errors = req.validationErrors();

		// console.log(errors);
		if(errors){
		res.render('admin/edit-category',{
			errors : errors,
			titleVar : title,
			idVar : id 
	  		 });  
	   } else {
		   Category.findOne({ slug: slug ,_id:{'$ne': id}} ,function(err, category){
			   console.log(slug);
			   if(category){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'Category title exists, choose another');
				   console.log('choose another');
					res.render('admin/edit-category',{
						titleVar : title,
						idVar : id
						}); 
			   } else {
				 Category.findById(id, function(err,category){
					 if(err) return console.log("Error in Post Route /admin/pages/edit-page/:slug", err);
						category.title = title;
						category.slug	= slug;
						category.save(function (err){
							if(err) 
								return console.log("Error in /admin/categories/edit-category Post Route", err);
								Category.find(function (err, categories) {
									if (err) {
									  console.log("Error in the app.js file Category.find()", err);
									} else {
									  req.app.locals.categories = categories;
									}
								  });
							// success is bootstrap class used in messages.ejs alert-<%= type%>
							// where type is replaced by success.
							req.flash('success', 'Category edited!!!');
							console.log('Category edited!!');
							res.redirect('/admin/categories');
					   });
				 });
			   }
		   });
	   }
	});


// Get delete category
// Complete path is /admin/categories/delete-category/:id
router.get('/delete-category/:id', isAdmin ,function(req,res){
	//Fetching data from the database 
	Category.findByIdAndRemove(req.params.id, function(err){
		if(err)
			return console.log("Error in deleting the Category", err)
			Category.find(function (err, categories) {
				if (err) {
				  console.log("Error in the app.js file Category.find()", err);
				} else {
				  req.app.locals.categories = categories;
				}
			  });
		req.flash('success', 'Category Deleted!!!');
		console.log('Category Deleted!!');
		res.redirect('/admin/categories');
	});
});



//Exports
module.exports = router;
