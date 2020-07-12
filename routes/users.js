var express = require('express');
var router  = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var bcrypt = require('bcryptjs');
require('dotenv').config();

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
		console.log("What is username", username);
		console.log("What is password", password);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect Mobile Number.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect OTP.' });
      }
      return done(null, user);
    });
  }
));

//Get Users Model
var User = require('../models/user');	 
var Location = require('../models/maps');	 

// Get  Register
// Complete path is /users/register
router.get('/register',function(req,res){
	res.render('register', {
		titleVar: 'Register'
	});
});

// Post  Register
// Complete path is /users/register
router.post('/register',function(req,res){
	var name = req.body.name ;
	var mobile = req.body.mobile;
//	var email  = req.body.email ;
//	var username = req.body.username ;
//	var password = req.body.password ;
//	var password2 = req.body.password2 ;

	//req.checkBody('name', 'Name is Required!!').isAlpha().withMessage('Name must consists of Only Alphabetical Characters').isLength({ min: 3 }).withMessage('Name Should be minimum 3 Characters Long');
	req.checkBody('name', 'Name is Required!!').isLength({ min: 3 }).withMessage('Name Should be minimum 3 Characters Long');
	req.checkBody('mobile', 'Invalid Mobile Number!!').isDecimal().isLength({min:10}).withMessage('oops Check Your Mobile Number');

	//req.checkBody('email', 'Email is Required!!').isEmail();
	//req.checkBody('username', 'Username is Required!!').notEmpty();
	//req.checkBody('password', 'Password is Required!!').notEmpty().isLength({min:4});
	//req.checkBody('password2', 'Password do not match!!').equals(password);

	var errors = req.validationErrors();
	if(errors){
		res.render('register', {
			errors: errors,
			user: null,
			titleVar: 'Register'
		});
	} else {
		User.findOne({username: mobile}, function(err,user){
			if(err){
				console.log("Error in the users.js file post route /users/register",err)
			}
			if(user){
				req.flash('danger', 'This Mobile Number Already Registered!, choose another!');
				res.redirect('/users/register');
			} else {
				var location = new Location({
					user: mobile,
					lat: 00,
					lng: 00
				});
				var user = new User({
					name: name,
					username: mobile,
				//	email: email,
				//	username: username,
				//	password: password,
		//			 admin:1
					admin:0
				});

//				bcrypt.genSalt(10, function(err,salt){
//				bcrypt.hash(user.password, salt, function(err,hash){
//					if(err) console.log("error in the bcrypt in users.js file post route /users/register ",err);
//					user.password = hash;
					location.save(function(err){
						if(err){
						console.log("Error in the  saving dummy location data to new user in users.js file post route /users/register ",err);
						}

					});
					user.save(function(err){
						if(err){
						console.log("Error in the users saving users.js file post route /users/register ",err);
						} else {
						req.flash('success', 'Successfully Registered, Login Now!!');
						res.redirect('/users/login');
						}
//					});
//				});
				});
			}
		});
	}

});

// Get  login
// Complete path is /users/login
router.get('/login',function(req,res){
	if(res.locals.user) res.redirect('/');
//	req.flash('success', 'Enter Your 10 Digits Mobile Number');
	res.render('login', {
		titleVar: 'Login'
	});
});

// Post  login
// Complete path is /users/login
// router.post('/login',function(req,res,next){
// 	passport.authenticate('local', {
// 			// successRedirect: '/',
// 			failureRedirect: '/users/login',
// 			failureFlash: true
// 	}) (req,res,next);
// });

const TwoFactor = new (require('2factor'))(process.env.APIKEY);
router.post('/login', function (req, res, next) {
	var vermobile = req.body.mobile;
	if( isNaN(vermobile)) {
		req.flash('danger', 'Only Numbers Allowed!!!');
	 return res.redirect('/users/login');
	}
	if((vermobile.length < 10 || vermobile.length > 10)){
	req.flash('danger', 'Invalid Mobile Number!!');
	console.log(vermobile);
	res.redirect('/users/login');
	} else { 
	User.findOne({ username: vermobile }, function (err, user) {
		if (err) { return console.log("err in the /users/login post route", err); }
		if (!user) {
			//   console.log((null, false,"error user not found"));
			req.flash('danger', 'This Mobile Number is Not Registered');
			req.flash('success', 'Register Below');
			res.redirect('/users/register');
		} else { 
//		var otp = Math.floor(100000 + Math.random() * 900000);
//		TwoFactor.sendTemplate(vermobile, 'OTP', [otp],'MMVOTP').then((result) => {
//			// console.log(sessionId);	
//			User.findOneAndUpdate({ username: vermobile }, { password: otp }, function (err, user) {
//				if (err) {
//					console.log("Error in the users saving users.js file post route /users/register ", err);
//	
//
//			} else {
//					// req.flash('success', 'Updated your otp to db!!');
//					//console.log("req.user in the post login end", req.user);
					res.render('verify', {mobileVar: vermobile});
//				}
//
//	});
//			
//		}, (error) => {
//			console.log(error);
//		});
//
}
	});
}
});

router.post('/verify', passport.authenticate('local', {
	// successRedirect: '/',
	failureRedirect: '/users/login',
	failureFlash: true
}), function (req,res,next) {
if(req.session.oldUrl){
	var oldUrl = req.session.oldUrl;
	req.session.oldUrl = null;
	res.redirect(oldUrl);
	req.flash('success', 'Successfully Logged In');
} else {
	res.redirect('/products');
}
});
//  function (req, res) {
// 	TwoFactor.verifyOTP(req.body.sessionId, req.body.a1 + req.body.a2 + req.body.a3 + req.body.a4 + req.body.a5 + req.body.a6).then((response) => {
// 		console.log(response);
// 		req.flash('success', 'Verification Successfull');

	// },
	//  (error) => {
	// 	console.log(error);
	// 	req.flash('danger', 'Invalid Otp!!');
	// 	res.redirect('/users/login');
	// });
// });




// Get  logout
// Complete path is /users/logout
router.get('/logout',function(req,res){
	req.logout();
	req.flash('success', 'You are logged Out');
	res.redirect('/products');
});

var auth = require('../config/auth');
var isUser = auth.isUser;
var  Order = require('../models/order');


// Get MyOrders
// Complete Path is /users/myorders
router.get('/myorders', isUser,function(req,res,next){
	
	Order.find({user : req.user}, function (err, orders) {
		if(err){
			return res.send("Check After Sometime!");
		}
		res.render('myorders', {ordersVar: orders});
	});

});


router.get('/:id', isUser, function(req,res){
	Order.findById({_id: req.params.id}, function(err, order){
		if(err){
			console.log("There is Error in fetching order details from database");
		}
		res.render('orderslist', {orderVar: order});
	});
});




//var mongoose = require('mongoose');

//var locationSchema = new mongoose.Schema({
  //lat: String,
  //lng: String
 
//});
// var Locationn = mongoose.model("Locationn", locationSchema);

router.post('/location',isUser, function(req,res){
	var lat = req.body.latt;
	var lng = req.body.long;
	console.log(  "lat and long data",lat, lng,req.user);
	var mapAttributes =  new Location ({
	user: req.user.username,
	lat: lat,
	lng: lng
});
Location.findOneAndDelete({user: req.user.username}, function(err,deleted){
	if(err){
		console.log("Error while Deleting Old Location");
		req.flash('danger', 'Error in Removing Old Location');
		res.redirect('/cart/checkout');
	}else {
		req.flash('danger', 'Old Address Removed!!!');
		console.log("old address removed!!!");
	}
});
	mapAttributes.save(function(err){
	if(err) return console.log("errors in the while saving lat and long", err);
	console.log("Succesfully added maps attribuiutes");
	}); 
});

var auth = require('../config/auth');
var isAdmin = auth.isAdmin ; 
//router.get('/admin/ordersearch',isAdmin, function(req,res){
router.get('/admin/ordersearch', function(req,res){
res.render('adminorders');
});

//router.get('/admin/orders',isAdmin, function(req,res){
router.get('/admin/orders', function(req,res){
var Completeorder = require('../models/completeorder');
    const reg = new RegExp(esc(req.query.order), 'gi');
    Completeorder.find({ orderId: reg }, function (err, products) {
      if (err) {
        console.log(err);
      } else {
//	console.log("new products searching order", products);
	res.render('adminordersearched',{ completeOrderVar: products});
      }	
});
});
function esc(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


//Exports 
module.exports = router;
