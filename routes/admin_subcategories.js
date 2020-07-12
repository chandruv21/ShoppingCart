var express = require('express');
var router  = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//Get Category Model
var SubCategory = require('../models/subcategory');	 


// Get Category index route
// Complete path is /admin/subcategories
router.get('/', isAdmin ,function(req,res){
	//Fetching data from the database 
		SubCategory.find({},function(err,subcategories){
			if(err){
				return console.log("There is error in /admin/subcategory Get Route", err);
			}
		res.render('admin/subcategories',{subcategoriesVar: subcategories});
	});
});

// Get add Page
// Complete path is /admin/add-subcategory
router.get('/add-subcategory', isAdmin ,function(req,res){
	var title = "";
	res.render('admin/add-subcategory',{
		titleVar : title,
	});
});

// Complete path is /admin/subcategories/add-subcategory
//Post request from the form.
router.post('/add-subcategory', function(req,res){
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
		res.render('admin/add-subcategory',{
			errors : errors,
			titleVar : title,
	  		 });  
	   } else {
		   //Slug should be unique so adding below line
		   SubCategory.findOne({ slug: slug}, function(err, subcategory){
			   console.log(slug);
			   if(subcategory){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'Category title exists, choose another');
				   console.log('choose another');
					res.render('admin/add-subcategory',{
						titleVar : title
						}); 
			   } else {
				   var  subcategory = new SubCategory({
					   title: title,
					   slug: slug
				   });
				   subcategory.save(function (err){
					if(err) return console.log("Error in /admin/subcategories/add-subcategory Post Route", err);
					SubCategory.find(function (err, subcategories) {
						if (err) {
						  console.log("Error in the subcategory file SubCategory.find()", err);
						} else {
						  req.app.locals.subcategories = subcategories;
						}
					  });
					// success is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by success.
					req.flash('success', 'SubCategory added!!!');
					console.log('SubCategory added!!');
					res.redirect('/admin/subcategories');
				   });
			   }
		   });
	   }
	});

// Get edit Category
// Complete path is /admin/categories/edit-category/:id
router.get('/edit-subcategory/sub/:id',isAdmin,function(req,res){
	SubCategory.findById(req.params.id, function(err, subcategory) {
		if(err){
			return console.log("Error in /admin/subcategories/edit-subcategory/:id", err);
		}
		res.render('admin/edit-subcategory',{
			titleVar : subcategory.title,
			idVar	 : subcategory._id
		});
	});
});
	



// Post Edit Category
// Complete path is /admin/categories/edit-category/:id
//Post request from the form to edit-page/:slug
router.post('/edit-subcategory/sub/:id',function(req,res){
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
		res.render('admin/edit-subcategory',{
			errors : errors,
			titleVar : title,
			idVar : id 
	  		 });  
	   } else {
		   SubCategory.findOne({ slug: slug ,_id:{'$ne': id}} ,function(err, subcategory){
			   console.log(slug);
			   if(subcategory){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'SubCategory title exists, choose another');
				   console.log('choose another');
					res.render('admin/edit-subcategory',{
						titleVar : title,
						idVar : id
						}); 
			   } else {
				 SubCategory.findById(id, function(err,subcategory){
					 if(err) return console.log("Error in Post Route edit in suncategory", err);
						subcategory.title = title;
						subcategory.slug	= slug;
						subcategory.save(function (err){
							if(err) 
								return console.log("Error in /admin/subcategories/edit-subcategory Post Route", err);
								SubCategory.find(function (err, subcategories) {
									if (err) {
									  console.log("Error in  SubCategory.find() in the subcategory file" , err);
									} else {
									  req.app.locals.subcategories = subcategories;
									}
								  });
							// success is bootstrap class used in messages.ejs alert-<%= type%>
							// where type is replaced by success.
							req.flash('success', 'SubCategory edited!!!');
							console.log('SubCategory edited!!');
							res.redirect('/admin/subcategories');
					   });
				 });
			   }
		   });
	   }
	});


// Get delete category
// Complete path is /admin/categories/delete-category/:id
router.get('/delete-subcategory/sub/:id', isAdmin ,function(req,res){
	//Fetching data from the database 
	SubCategory.findByIdAndRemove(req.params.id, function(err){
		if(err)
			return console.log("Error in deleting the SubCategory", err)
			SubCategory.find(function (err, subcategories) {
				if (err) {
				  console.log("Error in deleting the subcategory)", err);
				} else {
				  req.app.locals.subcategories = subcategories;
				}
			  });
		req.flash('success', 'SubCategory Deleted!!!');
		console.log('SubCategory Deleted!!');
		res.redirect('/admin/subcategories');
	});
});



//Exports
module.exports = router;
