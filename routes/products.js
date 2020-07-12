var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isUser = auth.isUser;


//Get Product Model
var Product = require('../models/product');

//Get Product Model
var Category = require('../models/category');
var SubCategory = require('../models/category');

// Get  all Products  
// Complete Path /products
router.get('/', function (req, res) {
  var Search = require('../models/search');
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Product.find({ title: regex }, function (err, products) {
      if (err) {
        console.log(err);
      } else {
        if (products.length < 1) {
          req.flash("danger", "Item Not Found");
          if (req.user == undefined) {
            var search = new Search({
              user: 'Unknown',
              searchedItem: req.query.search + " " + 'Notfound'
            });
            search.save(function (err, saved) {
              if (err) {
                console.log("error in saving search to db!");
                //		} else {
                //			console.log("save data!", saved);
              }
            });
          } else {
            var search = new Search({
              user: req.user.name + " " + req.user.username,
              searchedItem: req.query.search + " " + 'Notfound'
            });
            search.save(function (err, saved) {
              if (err) {
                console.log("error in saving search to db!");
                //		} else {
                //			console.log("saved data!", saved);
              }
            });
          }
          return res.redirect("back");
        }
        else {
          res.render('all_products', {
            titleVar: 'All products',
            productsVar: products
          });
        }
        if (req.user == undefined) {
          var search = new Search({
            user: 'Unknown',
            searchedItem: req.query.search + " " + 'Found'
          });
          search.save(function (err, saved) {
            if (err) {
              console.log("error in saving search to db!");
            }
          });
        } else {
          var search = new Search({
            user: req.user.name + " " + req.user.username,
            searchedItem: req.query.search + " " + 'Found'
          });
          search.save(function (err) {
            if (err) {
              console.log("error in saving search to db!");
            }
          });
        }

      }
    });
  } else {
    //	Product.find({}, function (err, products) {
    Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, products) {
      if (err)
        console.log(err);
      res.render('all_products', {
        titleVar: 'All products',
        productsVar: products
      });
    });
  }
});

// Get  Products By Category
// Complete Path /products/:category
router.get('/:category', function (req, res) {
  var categorySlug = req.params.category;
  Category.findOne({ slug: categorySlug }, function (err, category) {
    //Product.find({ category: categorySlug }, function (err, products) {
    Product.find({ category: categorySlug }).sort({ sorting: 'ascending' }).exec(function (err, products) {
      if (err)
        console.log(err);
      res.render('category_products', {
        titleVar: products.title,
        productsVar: products
      });
    });
  });

});


router.get('/sub/:category', function (req, res) {
  var subcategorySlug = req.params.category;
  SubCategory.findOne({ slug: subcategorySlug }, function (err, subcategory) {
    //Product.find({ category: categorySlug }, function (err, products) {
    Product.find({ subcategory: subcategorySlug }).sort({ sorting: 'ascending' }).exec(function (err, products) {
      if (err)
        console.log(err);
      res.render('subcategory_products', {
        titleVar: products.title,
        productsVar: products
      });
    });
  });

});
// Get  Product Details 
// Complete Path /products/:category/:product
// router.get('/:category/:product',function(req,res){

// // Not Require This route becasue am not displaying gallery images
// var loggedIn = (req.isAuthenticated()) ? true: false;
// 	res.render('product', {loggedIn: loggedIn});
// });


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Exports
module.exports = router;

