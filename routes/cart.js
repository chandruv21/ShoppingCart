var express = require('express');
var router = express.Router();

//Get Product Model
var Product = require('../models/product');
var Order = require('../models/order');
var auth = require('../config/auth');
var isUser = auth.isUser;

var kgNum ;
// Get add product to cart
// Complete path /cart/add/:product
router.get('/cart/add/:product', function (req, res) {
    var slug = req.params.product;
	//console.log(slug);
    Product.findOne({ title: slug }, function (err, product) {
      //console.log( "Product Detailsaaaaa",product);
      var myArray = product.kg.split(/([0-9]+)/);
      kgNum = parseInt(myArray[1]);
      var kgText = myArray[2];
        if (err)
            console.log(err);
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: '/product_images/' + product._id + '/' + product.image,
		kgNum: kgNum,
		kgText: kgText,
		productCat: product.category
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;
            //console.log("ddddddddddddddddd", product)
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
		if( cart[i].kgNum == 500 ){
 		cart[i].kgNum  =  (cart[i].kgNum + 500)/1000;
                    cart[i].qty++;
		    cart[i].kgText = 'Kg';
		}else {
		 cart[i].kgNum += 1;
                    cart[i].qty +=2;
		    cart[i].kgText = 'Kg';
		}
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: '/product_images/' + product._id + '/' + product.image,
		    kgNum: kgNum,
	            kgText: kgText,
	            productCat: product.category

                });
            }
        }
        var cart = req.session.cart;
 //       console.log("req.session.cart in add product",req.session.cart);
//        req.flash('success', 'Product added!');
        res.redirect('back');
    });
});





router.get('/cart/addpi/:product', function (req, res) {
    var slug = req.params.product;
    Product.findOne({ title: slug }, function (err, product) {
        //console.log( "Product Details",product);
        if (err)
            console.log(err);
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: '/product_images/' + product._id + '/' + product.image,
		productCat: product.category
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: '/product_images/' + product._id + '/' + product.image,
		    productCat: product.category
                });
            }
        }
//         var cart = req.session.cart;
//         console.log("req.session.cart in add product",req.session.cart);
// //        req.flash('success', 'Product added!');
        res.redirect('back');
    });
});









// Get Update Product 
// Complete path /cart//update/:product
router.get('/cart/update/:product', function (req, res) {
    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
		if( cart[i].kgNum == 500 ){
 		cart[i].kgNum  =  (cart[i].kgNum + 500)/1000;
                    cart[i].qty++;
		    cart[i].kgText = 'Kg';
		}else {
		 cart[i].kgNum += 1;
                    cart[i].qty +=2;
		    cart[i].kgText = 'Kg';
		}
//		    cart[i].kgNum = value;
                    break;
                case "remove":
			    if(cart[i].kgNum == 1) {
		    		cart[i].kgText = 'grams';
                    		cart[i].qty--;
			 	cart[i].kgNum = 0.5*1000;
			    } else { 
		 	     cart[i].kgNum = (cart[i].kgNum - 1);
		    		cart[i].kgText = 'Kg';
                    		cart[i].qty-=2;
			    }
		 //   cart[i].kgNum = value1;
                    if (cart[i].qty < 1) cart.splice(i,1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('Update Problem');
                    break;
            }
            break;
        }
    }
//    req.flash('success', 'Cart Updated!');
    res.redirect('back');
});


router.get('/cart/updatepi/:product', function (req, res) {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1) cart.splice(i,1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('Update Problem');
                    break;
            }
            break;
        }
    }
//    req.flash('success', 'Cart Updated!');
    res.redirect('back');
});







// Get CheckOut Page!
// Complete path /cart/checkout
router.get('/cart/checkout/' ,isUser, function (req, res) {
    var loggedIn = (req.isAuthenticated()) ? true : false;

     if (req.session.cart && req.session.cart.length == 0) {
          delete req.session.cart;
         res.redirect('/products');
     } else {
        res.render('checkout', {
            titleVar: 'CheckOut',
            cartVar: req.session.cart,
            loggedInVar: loggedIn
        });
     }

});

//router.post('/cart/checkout', isUser, function (req, res) {
//    if (req.session.cart && req.session.cart.length == 0) {
//        delete req.session.cart;
//        res.redirect('/cart/checkout');
//    } else {
//    var order = new Order({
//        user: req.user,
 //       cart: req.session.cart,
//        address: req.body.address,
//        name: req.body.name,
//        paymentId: "6554assasafsdfdsfs"
//    });
//    delete req.session.cart;
//    order.save(function (err, result) {
//        if (err) {
 //           console.log("Major error in saving order to db", err);
//        }
//        req.flash('success', 'Order placed! Payment mode: Online Payment');
//        res.redirect('/products');
//    });
//}
//});

// Complete Path is /cart/buy
router.get('/cart/buy', isUser, function (req, res) {
    res.render('buy');
});

// POST cod 
router.post('/cart/cod', isUser, function (req, res) {
    if (req.session.cart && req.session.cart.length == 0) {
        // delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        var OrderID = require('../models/orderid');
     // Use below 7 lines code when Database is not Created For orderid after running Below Code then you can add data
     //    var orderid = new OrderID({
     //       name: 'Orders',
     //       orderid: '80000000'
     //    });
     //    orderid.save(function(err, result){
     //        if(err) return   console.log("Error While Saving ORDERID", err);
     //    });
        OrderID.find({}, function (err, found) {
            if (err) {
                console.log("Error in finding the OderID");
            } else {
//                console.log("Found OrderID", found);
                var updatedOrderId = found[0].orderid + 1;
                OrderID.findOneAndUpdate({ name: 'Orders' }, { orderid: updatedOrderId }, function (err, orderids) {
                    if (err) {
                        console.log("Err in updating Orderid", err);
                    } else {
                        // console.log("Updated ORDERID", orderids);
                        var Location = require('../models/maps');
             //           console.log("req.user in the /cod", req.user);
             //           console.log("req.user in the /cod", req.session.cart);
                        Location.findOne({user: req.user.username}, function (err, location) {
			//	console.log("location fetched", location);
				if((location.lat > 12.95 && location.lat < 13.02) && (location.lng > 77.44 && location.lng < 77.51)) {
//				if((location.lat > 12.965038 && location.lat < 13.01) || (location.lng > 77.456274 && location.lng < 77.50)) {
                            var order = new Order({
                                user: req.user,
                                cart: req.session.cart,
                                address: req.body.address,
                                lat: location.lat,
                                lng: location.lng,
                                //      name: req.body.name,
                                paymentId: "cash1546waasdad",
                                orderId: updatedOrderId
                            });
                            var Username = req.user.name;
                            var Mobile = req.user.username;
                            var Address = req.body.address;
                            var Latittude = location.lat;
                            var Longitude = location.lng;
                            var orderId = updatedOrderId;
                            var Product = '';
                            var Total_amount = 0;
                            for (let i = 0; i < req.session.cart.length; i++) {
				    console.log("cart session in /cart/cod", req.session.cart);
                                var j;
                                j = req.session.cart[i].price * req.session.cart[i].qty;
                                Total_amount += j;
				    if(req.session.cart[i].productCat == "pooja-items"){
					Product += '\n' + "Item-" + [i + 1] + ':' + '\n' + req.session.cart[i].title + " ,Quantity:" + req.session.cart[i].qty + "=" + req.session.cart[i].price * req.session.cart[i].qty + '₹' + '\n';
				    } else {
                                Product += '\n'+ "Item-"+[i+1]+ ':' +'\n' +req.session.cart[i].title + " ,Quantity:" + req.session.cart[i].kgNum + req.session.cart[i].kgText+ "=" + req.session.cart[i].price * req.session.cart[i].qty + '₹' + '\n';
				    }
                            }
                            delete req.session.cart;
                            var CompleteOrder = require('../models/completeorder');
                            var completeorder = new CompleteOrder({
                                orderId: orderId,
                                username: Username,
                                mobile: Mobile,
                                address: Address,
                                latittude: Latittude,
                                longitude: Longitude,
                                product: Product,
                                total_amount: Total_amount
                            });
                            completeorder.save(function(err, result){
                                if (err) {
                                    console.log("Major error in saving order to db", err);
                                }
                            });
                            order.save(function (err, result) {
                                if (err) {
                                    console.log("Major error in saving order to db", err);
                                }
                                req.flash('success', 'Order placed! Your Order Will Be Delivered within 80 Minutes.');
                                res.redirect('/users/myorders');
                            });
					var Total = Total_amount + ' ₹' ; 
//				 const TwoFactor = new (require('2factor'))(process.env.APIKEY);
//	                          TwoFactor.sendTemplate(Mobile,'customer order details121',[Username,orderId,Total],'DLIVRY').then((response) => {
//                                 console.log("customer Order Details Message Sent", response);
//                                   }, (error) => {
//                                 console.log(error);
//                               });
// 				  const ordersmobile = 6360735780;
//        	                 TwoFactor.sendTemplate(ordersmobile,'Deliverying Orders1',[orderId],'DLIVRY').then((response) => {
//                                 console.log("Order Details sent to mobile number"+" " +ordersmobile , response);
//                                 }, (error) => {
//                                 console.log(error);
//                              });
		} else {
                     Location.findOne({user: req.user.username}, function (err, location) {
			if(err){
				console.log("error in saving new area user location to db");
			}else {
				//console.log("location in new user", location);
                      var NewArea = require('../models/newareamaps');
			     var newArea = NewArea ({
				     user: req.user.name,
				     mobile: req.user.username,
				     lat: location.lat,
				     lng: location.lng
			     }); 
			     newArea.save(function(err, result){
                                if (err) {
                                    console.log("Major error in saving newArea to db", err);
                                }
                            });
		}
	});

                     req.flash('success', 'Hey' + ' ' +  req.user.name + ' ' +  'NOTE:'+ " WE ARE HAPPY TO NOTICE THAT YOU WANT TO PLACE THE ORDER!" +'\n' + "WE ARE COMING SOON TO SERVE YOUR AREA!" );
                     res.redirect('/products#top');


		}
                        });
                    }
                });
      	     }
        });
    }
});



// Get Clear Cart
// Complete path /cart/clear
router.get('/cart/clear/', function (req, res) {
    delete req.session.cart;
    req.flash('success', 'Cart Cleared!');
    res.redirect('/cart/checkout');
});
router.get('/cart/min/', function (req, res) {
    // delete req.session.cart;
    req.flash('danger', 'Minimum purchase 49Rs');
    res.redirect('/products');
});

router.get('/cart/azsearch', function(req,res){
//    Product.find({}, function (err, products) {
	Product.find({}).sort({ sorting: 'ascending' }).exec(function (err, products) {
        if (err){
            console.log ( "error in azsearch",err);
	} 
	    else {
        res.render('azsearch', {
            titleVar: 'All products',
            productsVar: products
        });
	}
    });
});


//Exports
module.exports = router;
