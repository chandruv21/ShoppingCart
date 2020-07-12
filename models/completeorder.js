var mongoose = require('mongoose');

//Complete Order Schema


var CompleteOrderSchema = mongoose.Schema({
    orderId: String,
    username:  String,
    mobile: String,
    address: String,
    latittude: String,
    longitude: String,
    product: String,
    total_amount:  Number,
});

var CompleteOrder = module.exports = mongoose.model('CompleteOrder', CompleteOrderSchema);

