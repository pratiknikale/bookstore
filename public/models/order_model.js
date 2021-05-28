var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    userId: Number,
    amount: Number,
    currency: String,
    receipt: String,
    payment_capture: String,
    payment_status: String,
    product: String,
    razorpay_OrderId: String
});

module.exports = mongoose.model("orders", orderSchema);