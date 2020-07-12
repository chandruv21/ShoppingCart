var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
const compression = require('compression');

//Connecting to db
// mongoose.connect('mongodb://localhost/cmscart', {useNewUrlParser: true, useUnifiedTopology: true});
//OR
//Requiring configuration from config directory --> database.js file.
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
//To verify whether Database is connected or not 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to mongo db");
});

//Initialize app
var app = express();

// compress all responses
app.use(compression());


//View  Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set Public Directory
app.use(express.static(path.join(__dirname, 'public')));

//Set Global error Variables
app.locals.errors = null;

// Get Page Model
var Page = require('./models/page');

// Get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 'ascending' }).exec(function (err, fetchedPages) {
  if (err) {
    console.log("Error in the app.js file Page.find()", err);
  } else {
    app.locals.pages = fetchedPages;
  }
});

// Get Category Model
var Category = require('./models/category');
var SubCategory = require('./models/subcategory');

// Get all Categories to pass to header.ejs
Category.find(function (err, categories) {
  if (err) {
    console.log("Error in the app.js file Category.find()", err);
  } else {
    app.locals.categories = categories;
  }
});

SubCategory.find(function (err, subcategories) {
  if (err) {
    console.log("Error in the app.js file SubCategory.find()", err);
  } else {
    app.locals.subcategories = subcategories;
  }
});
//Middlewares

// Express FileUpload Middleware
app.use(fileUpload());

//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Express Session middleware
app.use(session({
  secret: 'escn',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 }
}));

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case 'svg':
          return '.svg';
        case '':
          return '.jpg';
        default:
          return false;
      }
    }
  }
}));

//Express Messages Middleware
var flash = require('connect-flash');
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req,res,next){
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});

//Setting Routes
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminSubCategories = require('./routes/admin_subcategories.js');
var adminProducts = require('./routes/admin_products.js');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/subcategories', adminSubCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/', cart);
app.use('/users', users);
app.use('/', pages);



app.get('*', function(req,res){
res.redirect('/');
});







































// // Dependencies
  const fs = require('fs');
  const https = require('https');
  const http = require('http');


 // Certificate
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/mahadevamart.in/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/mahadevamart.in/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/mahadevamart.in/chain.pem', 'utf8');
  const credentials = {
  	key: privateKey,
	cert: certificate,
  	ca: ca
  	};
		// Starting both http & https servers
  		const httpsServer = https.createServer(credentials, app);
		const httpServer = http.createServer(app);
 			httpsServer.listen(443, () => {
			console.log('HTTPS Server running on port 443');
			});
	 http.createServer(function(req,res){    
	    // 301 redirect (reclassifies google listings)
	    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
   res.end();
	}).listen(80, function(err){
		console.log('HTTP Server listening on port 80 but redirecting 443 ');
	});
//app.use(express.static(__dirname, { dotfiles: 'allow' } ));


// Start the Server 
//app.listen(80, function () {
// console.log("Server Started!!!");
//});
