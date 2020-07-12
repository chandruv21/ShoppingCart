var mongoose = require('mongoose');
var User = require('./user.js');

//Order Schema


var OrderSchema = mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart:
    {
        type: Object,
        required: true
    },
    address:
     {
        type: String,
        // required: true
    },
    lat: {
	type: String,
	// required: true
	},
    lng: {
	type: String,
	// requires: true
	},
//    name:
//    {
//      type: String,
//        required: true
//    },
    paymentId: 
    {
        type: String,
        required: true
    },
    orderId: 
    {
        type: Number,
        required: true
    }

});

var Order = module.exports = mongoose.model('Order', OrderSchema);

