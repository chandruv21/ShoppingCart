var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//Get Product Model
var Product = require('../models/product');

//Get Category Model
var Category = require('../models/category');
var SubCategory = require('../models/subcategory');

// Get Product index route
// Complete path is /admin/products
router.get('/',isAdmin, function (req, res) {
	Product.find({}).sort({ sorting: 'ascending'}).exec(function (err, products) {
//		console.log("products", products);
		res.render('admin/products', {
			productsVar: products
		});
	});
});


// Get add Product
// Complete path is /admin/products/add-product
router.get('/add-product', isAdmin,function (req, res) {
	var title = "";
	var desc = "";
	var kg = "";
	var price = "";
	Category.find(function (err, categories) {
	SubCategory.find(function (err, subcategories) {
		res.render('admin/add-product', {
			titleVar: title,
			descVar: desc,
			kgVar: kg,
			categoriesVar: categories,
			subcategoriesVar: subcategories,
			priceVar: price
		});
           });
	});
});

// Complete path is /admin/products/add-product
//Post request from the form to add-product
router.post('/add-product',function (req, res) {

	if (!req.files) { imageFile = ""; }
	if (req.files) {
		var imageFile = typeof (req.files.image) !== "undefined" ? req.files.image.name : "";
		console.log("req.files.image.name in the /admin/products post ", req.files.image.name);
	}
	// var imageFile = typeof req.files !== "undefined" ? req.files.image.name : "";

	// console.log("image file name", imageFile);
	// Validating title ,Description ,price and image variables 
	// title, Description, price and image should not be empty becasue 
	// we defined in the file models/product.js as title, Description , price and image  "required: true"

	// req.checkBody(field[, message])
	req.checkBody('title', "Title can't be Empty").notEmpty();
	req.checkBody('desc', "Description can't be Empty").notEmpty();
	//req.checkBody('price', "Price can't be Empty").isDecimal();
	req.checkBody('price', "Price can't be Empty").notEmpty();
	req.checkBody('image', "you must upload an image!!").isImage(imageFile);


	// Fetched Data from the form.
	var title = req.body.title;
	var slug = title.replace(' ', '-').toLowerCase();
	var desc = req.body.desc;
	var kg = req.body.kg;
	var bothprice = req.body.price;
	var category = req.body.category;
	var subcategory = req.body.subcategory;


  var myVar = bothprice.split(' ');
     var  dummyPrice = parseFloat(myVar[0]).toFixed(2);
     var  price = parseFloat(myVar[1]).toFixed(2);

	errors = req.validationErrors();

	// console.log(errors);
	if (errors) {
		Category.find(function (err, categories) {
		SubCategory.find(function (err, subcategories) {
			res.render('admin/add-product', {
				errors: errors,
				titleVar: title,
				descVar: desc,
				kgVar:kg,
				categoriesVar: categories,
				subcategoriesVar: subcategories,
				dummyPriceVar: dummyPrice,
				priceVar: price
			});
		});
		});
	} else {
		Product.findOne({ slug: slug }, function (err, product) {
			// console.log(slug);
			if (product) {
				// danger is bootstrap class used in messages.ejs alert-<%= type%>
				// where type is replaced by danger.
				req.flash('danger', 'Product title exists, choose another');
				console.log('choose another');
				Category.find(function (err, categories) {
				SubCategory.find(function (err, subcategories) {
					res.render('admin/add-product', {
						titleVar: title,
						descVar: desc,
						kgVar:kg,
						categoriesVar: categories,
						subcategoriesVar: subcategories,
						dummyPriceVar: dummyPrice,
						priceVar: price
					});
					});
				});
			} else {

				var product = new Product({
					title: title,
					slug: slug,
					desc: desc,
					kg: kg,
					dummyprice: dummyPrice,
					price: price,
					category: category,
					subcategory: subcategory,
					image: imageFile,
					sorting:100000
				});
				product.save(function (err) {
					if (err)
						return console.log("Error in /admin/products/add-product Post Route", err);

					fs.mkdirs('public/product_images/' + product._id, function (err) {
						return console.log(err);
					});
					fs.mkdirs('public/product_images/' + product._id + '/gallery', function (err) {
						return console.log(err);
					});
					fs.mkdirs('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
						return console.log(err);
					});

					if (imageFile != "") {
						var productImage = req.files.image;
						var path = 'public/product_images/' + product._id + '/' + imageFile;
						productImage.mv(path, function (err) {
							return console.log(err);
						});
					}
					Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedProducts) {
						if (err) {
						  console.log("Error in the app.js file Page.find()", err);
						} else {
						  req.app.locals.products = fetchedProducts;
						}
					  });


					// success is bootstrap class used in messages.ejs alert-<%= type%>
					// where type is replaced by success.
					req.flash('success', 'Product added!!!');
					console.log('Product added!!');
					res.redirect('/admin/products');
				});
			}
		});
	}
});


// Get edit Product
// Complete path is /admin/products/edit-product/:id
router.get('/edit-product/:id', isAdmin,function (req, res) {

	var errors;
	if (req.session.errors) {
		errors = req.session.errors;
		req.session.errors = null;
	}

	Category.find(function (err, categories) {
	SubCategory.find(function (err, subcategories) {

		Product.findById(req.params.id, function (err, product) {
			if (err) {
				console.log("Error in /admin/products/edit-product/:id", err);
				res.redirect("/admin/products");
			} else {
				var galleryDir = 'public/product_images/' + product._id + '/gallery';
				var galleryImages = null;
				fs.readdir(galleryDir, function (err, files) {
					if (err) {
						console.log("Error in /admin/products/edit-product/:id fs.readdir", err);
					} else {
						galleryImages = files;

						res.render('admin/edit-product', {
							titleVar: product.title,
							errors: errors,
							descVar: product.desc,
							kgVar: product.kg,
							categoriesVar: categories,
							categoryVar: product.category.replace(' ', '-').toLowerCase(),
							subcategoriesVar: subcategories,
							subcategoryVar: product.subcategory.replace(' ', '-').toLowerCase(),
							priceVar: parseFloat(product.price).toFixed(2),
							dummyPriceVar: parseFloat(product.dummyprice).toFixed(2),
							imageVar: product.image,
							galleryImagesVar: galleryImages,
							idVar : product._id
						});
					}
				});

			}
		});
		});

	});

});




// Post Edit Product
// Complete path is /admin/products/edit-product/:id
//Post request from the form to edit-producte/:id
router.post('/edit-product/:id', function (req, res) {

	if (!req.files) 
		{ imageFile = ""; }
	if (req.files) {
		var imageFile = typeof (req.files.image) !== "undefined" ? req.files.image.name : "";
	}

		// Validating title ,Description ,price and image variables 
	// title, Description, price and image should not be empty becasue 
	// we defined in the file models/product.js as title, Description , price and image  "required: true"

	// req.checkBody(field[, message])
	req.checkBody('title', "Title can't be Empty").notEmpty();
	req.checkBody('desc', "Description can't be Empty").notEmpty();
//	req.checkBody('price', "Price can't be Empty").isDecimal();
	req.checkBody('price', "Price can't be Empty").notEmpty();
	req.checkBody('image', "you must upload an image!!").isImage(imageFile);


	// Fetched Data from the form.
	var title = req.body.title;
	var slug = title.replace(' ', '-').toLowerCase();
	var desc = req.body.desc;
	var kg = req.body.kg;
	var bothprice = req.body.price;
	var category = req.body.category;
	var subcategory = req.body.subcategory;
	var pimage = req.body.pimage;
	var id = req.params.id;

  var myVar = bothprice.split(' ');
     var  dummyPrice = parseFloat(myVar[0]).toFixed(2);
     var  price = parseFloat(myVar[1]).toFixed(2);
	errors = req.validationErrors();

	if(errors) {
		req.session.errors = errors;
		res.redirect('/admin/products/edit-product/' + id);
	} else {
		Product.findOne({slug: slug, _id: {'$ne': id}}, function(err, product){
			if(err){
				console.log("Error in /admin/products/edit-product/:id POST Route ", err);
			}
			if(product){
				req.flash('danger', 'Product title exists Choose another');
				res.redirect('/admin/products/edit-product/'+ id);
			} else {
				Product.findById(id, function(err, product){
					if(err){
						console.log("Error in /admin/products/edit-product/:id Post route 2nd error ",err);
					}
						product.title = title ; 
						product.slug = slug ; 
						product.desc = desc ; 
						product.kg = kg ; 
						product.price = price ; 
						product.dummyprice = dummyPrice ; 
						product.category = category ; 
						product.subcategory = subcategory ; 

						if(imageFile != ""){
							product.image = imageFile;
						}
						product.save(function(err){
							if(err){
								console.log("Error in /admin/products/edit-product/:id Post route 3rd error ",err);
							}
							Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedProducts) {
									if (err) {
									  console.log("Error in the routes/admin_products,js file Product.find() in edit route", err);
									} else {
									  req.app.locals.products = fetchedProducts;
									}
								  });

							// Removing existing image
							if(imageFile != "") {
		                                           if(pimage != "") {
							     fs.remove('public/product_images/'+id+'/'+pimage , function(err){
							 	if(err){
							          console.log("Error in /admin/products/edit-product/:id Post route 4th error ",err);
								}
							    });
								}
									var productImage = req.files.image;
									var path = 'public/product_images/' + id + '/' + imageFile;
									productImage.mv(path, function (err) {
										return	console.log("Error in /admin/products/edit-product/:id Post route 5th error ",err);
									});
								}
								req.flash('success', 'Product Edited!');
								res.redirect('/admin/products/');
						});
				});
			}
		});
	}
});

// Post Product Gallery
router.post('/product-gallery/:id',isAdmin, function(req,res){
	var productImage = req.files.file;
	var id = req.params.id;
	var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
	var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

	productImage.mv(path, function(err){
		if(err)
			console.log(err);
		
			resizeImg(fs.readFileSync(path), {width:100, height:100}).then(function(buf){
			fs.writeFileSync(thumbsPath, buf);
		});
	});
	res.sendStatus(200);
});


// Get Delete image

router.get('/delete-image/:image', function(req,res){
	var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
	var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;
	fs.remove(originalImage, function (err){
		if(err){
			console.log("Error in /admin/products/delete-image/:image get route 1st error",err );
		} else {
			fs.remove(thumbImage, function(err){
				if(err){
					console.log("Error in /admin/products/delete-image/:image get route 2nd error",err );
				} else {
					req.flash('success', "Image Deleted!");
					res.redirect('/admin/products/edit-product/'+req.query.id);
				}
			})
		}
	});

});
// Sort Products Function

function sortProducts(ids, callback) {
	var count = 0;
	for (let i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;

		// comment function line no. 104 and 115 and go to mongodb and see the sorting Value.
		// By using below function we will get sorting order
		(function(count){ 
			Product.findById(id, function(err, product){
				product.sorting = count;
				product.save(function(err){
					if(err)
					  return console.log("Error in /admin/products/reorder-products Post route",err);
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
router.post('/reorder-products', function(req,res){
	var ids = req.body['id[]'];

	sortProducts(ids,function(){
		Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedProducts) {
			if (err) {
			  console.log("Error in the /routes /admin_products file Product.find()", err);
			} else {
			  req.app.locals.products = fetchedProducts;
			}
		  });
		});
	});
	

// Get delete product
// Complete path is /admin/product/delete-product/:id
router.get('/delete-product/:id', isAdmin,function (req, res) {
	var id = req.params.id;
	var path = 'public/product_images/'+ id;
	fs.remove(path, function(err){
		if(err){
			console.log(err);
		} else {
			Product.findByIdAndRemove(id, function(err){
				return console.log( "Erro in deleting the product in routes/admin_products delete route", err);
				Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedProducts) {
				 if (err) {
				  console.log("Error in the routes/admin_products,js file Product.find() in edit route", err);
				 } else {
				  req.app.locals.products = fetchedProducts;
				}
			  });
			});
			req.flash('success', "product Deleted!");
			res.redirect('/admin/products/');
		}
	});
});




//Exports
module.exports = router;
