var mongoose = require('mongoose');

//OrderID Schema


var OrderIDSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    orderid:
    {
        type: Number,
        required: true
    }

});

var OrderID = module.exports = mongoose.model('OrderID', OrderIDSchema);

