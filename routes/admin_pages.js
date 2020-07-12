var express = require('express');
var router  = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//Get Page Model
var Page = require('../models/page');	 


// Get pages index route
// Complete path is /admin/pages
router.get('/', isAdmin ,function(req,res){
	//Fetching data from the database 
	Page.find({}).sort({ sorting: 'ascending'}).exec(function(err, fetchedPages){
		res.render('admin/pages',{fetchedPagesVar: fetchedPages});
	});
});

// Get add Page
// Complete path is /admin/pages/add-page
router.get('/add-page' , isAdmin ,function(req,res){
	var title = "MahadevaMart";
	var slug  = 'slug' ;
	var content = 'E commerce Website';
	res.render('admin/add-page',{
		titleVar : title,
		slugVar  : slug,
		contentVar : content	 
	});
});

// Complete path is /admin/pages/add-page
//Post request from the form to add-page
router.post('/add-page',function(req,res){
	// Validating title and content variables 
	// both title and content should not be empty becasue 
	// we defined in the file models/page.js as title and content both are "required: true"

	// req.checkBody(field[, message])
	   req.checkBody('title' ,"Title can't be Empty").notEmpty();
	   req.checkBody('content',"Content can't be Empty").notEmpty();

	// Fetched Data from the form.
	   var title = req.body.title;
	   //If Slug is empty we are replacing all the spaces with '#' symbol.
	   //and If slug as some value we are converting to LowerCase.
	   var slug = req.body.slug.replace(' ','-').toLowerCase();
	   //If slug is empty  copy title and add to slug.
	   if(slug == ""){
		slug=title.replace(' ','-').toLowerCase();
	   }
	   var content = req.body.content;

		errors = req.validationErrors();

		// console.log(errors);
		if(errors){
		res.render('admin/add-page',{
			errors : errors,
			titleVar : title,
			slugVar  : slug,
			contentVar : content	 
	  		 });  
	   } else {
		   //Slug should be unique so adding below line
		   Page.findOne({ slug: slug}, function(err, page){
			   console.log(slug);
			   if(page){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'Page slug exists, choose another');
				   console.log('choose another');
					res.render('admin/add-page',{
						titleVar : title,
						slugVar  : slug,
						contentVar : content,
						}); 
			   } else {
				   var  page = new Page({
					   title: title,
					   slug: slug,
					   content: content,
					   sorting: 100
				   });
				   page.save(function (err){
					if(err) return console.log("Error in /admin/pages/add-page Post Route", err);
					Page.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedPages) {
						if (err) {
						  console.log("Error in the app.js file Page.find()", err);
						} else {
						  req.app.locals.pages = fetchedPages;
						}
					  });
					// success is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by success.
					req.flash('success', 'Page added!!!');
					console.log('Page added!!');
					res.redirect('/admin/pages');
				   });
			   }
		   });
	   }
	});

// Sort Pages Function

function sortPages(ids, callback) {
	var count = 0;
	for (let i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;

		// comment function line no. 104 and 115 and go to mongodb and see the sorting Value.
		// By using below function we will get sorting order
		(function(count){ 
			Page.findById(id, function(err, page){
				page.sorting = count;
				page.save(function(err){
					if(err)
					  return console.log("Error in /admin/pages/reorder-page Post route",err);
					  ++count;
					  if(count >= ids.length) {
						  callback();
					  }
				});
			});
		}) (count);	
	}	
}


// Post Reorder Pages
//Complete Path /admin/pages/reorder-page
router.post('/reorder-page', function(req,res){
	var ids = req.body['id[]'];

	sortPages(ids,function(){
		Page.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedPages) {
			if (err) {
			  console.log("Error in the app.js file Page.find()", err);
			} else {
			  req.app.locals.pages = fetchedPages;
			}
		  });
		});
	});
	

// Get edit Page
// Complete path is /admin/pages/edit-page/:slug
router.get('/edit-page/:id' ,isAdmin,function(req,res){
	Page.findById(req.params.id, function(err, page) {
		if(err){
			return console.log("Error in /admin/pages/edit-page/:id", err);
		}
		res.render('admin/edit-page',{
			titleVar : page.title,
			slugVar  : page.slug,
			contentVar : page.content,
			idVar	 : page._id
		});
	});
});
	



// Post Edit Page
// Complete path is /admin/pages/edit-page/:slug
//Post request from the form to edit-page/:slug
router.post('/edit-page/:id',function(req,res){
	// Validating title and content variables 
	// both title and content should not be empty becasue 
	// we defined in the file models/page.js as title and content both are "required: true"

	// req.checkBody(field[, message])
	   req.checkBody('title' ,"Title can't be Empty").notEmpty();
	   req.checkBody('content',"Content can't be Empty").notEmpty();

	// Fetched Data from the form.
	   var title = req.body.title;
	   //If Slug is empty we are replacing all the spaces with '#' symbol.
	   //and If slug as some value we are converting to LowerCase.
	   var slug = req.body.slug.replace(' ','-').toLowerCase();
	   //If slug is empty  copy title and add to slug.
	   if(slug == ""){
		slug=title.replace(' ','-').toLowerCase();
	   }
	   var content = req.body.content;
	   var id = req.params.id;

		errors = req.validationErrors();

		// console.log(errors);
		if(errors){
		res.render('admin/edit-page',{
			errors : errors,
			titleVar : title,
			slugVar  : slug,
			contentVar : content,
			idVar : id 
	  		 });  
	   } else {
		   Page.findOne({ slug: slug ,_id:{'$ne': id}} ,function(err, page){
		//    Page.findOne({ slug: slug , _id:{'$ne': id}} ,function(err, page){

		//    Page._id is not equal to id
			   console.log(slug);
			   if(page){
				   // danger is bootstrap class used in messages.ejs alert-<%= type%>
				   // where type is replaced by danger.
				   req.flash('danger', 'Page slug exists, choose another');
				   console.log('choose another');
					res.render('admin/edit-page',{
						titleVar : title,
						slugVar  : slug,
						contentVar : content,
						idVar : id
						}); 
			   } else {
				 Page.findById(id, function(err,page){
					 if(err) return console.log("Error in Post Route /admin/pages/edit-page/:slug", err);
					 
						page.title = title;
						page.slug	= slug;
						page.content = content;
						page.save(function (err){
							if(err) 
								return console.log("Error in /admin/pages/edit-page Post Route", err);
								Page.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedPages) {
									if (err) {
									  console.log("Error in the app.js file Page.find()", err);
									} else {
									  req.app.locals.pages = fetchedPages;
									}
								  });
							// success is bootstrap class used in messages.ejs alert-<%= type%>
						// where type is replaced by success.
							req.flash('success', 'Page edited!!!');
							console.log('Page edited!!');
							res.redirect('/admin/pages/');
					   });
				 });
			   }
		   });
	   }
	});

// Get delete page
// Complete path is /admin/pages
router.get('/delete-page/:id', isAdmin ,function(req,res){
	//Fetching data from the database 
	Page.findByIdAndRemove(req.params.id, function(err){
		if(err)
			return console.log("Error in deleting the page", err)
			Page.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedPages) {
				if (err) {
				  console.log("Error in the app.js file Page.find()", err);
				} else {
				  req.app.locals.pages = fetchedPages;
				}
			  });
		req.flash('success', 'Page Deleted!!!');
		console.log('Page Deleted!!');
		res.redirect('/admin/pages');
	});
});




//Exports
module.exports = router;
