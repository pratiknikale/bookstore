var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const crypto = require('crypto');
var books = require('../public/models/books_model.js');
var orderMd = require('../public/models/order_model.js');
dotenv.config();
const instance = new Razorpay({
    key_id : process.env.KEY_ID,
    key_secret : process.env.KEY_SECRET,
 });

router.get('/:cart', function (req, res) {

    // if (!mongoose.Types.ObjectId.isValid(req.params.cart)) {
        //res.send('cart is empty');
        // res.render('./public/cart.ejs', { msg: '' });
    // }

    if(req.params.cart == 'noBooks'){
        res.render('./public/cart.ejs', { msg: '' , key: process.env.KEY_ID });
    }
    else {

        var cartArr = req.params.cart.split(';');
        var cartTOPass = [];
        cartArr.forEach(element => {
            if(element != ''){

                var temp = {
                    '_id': element
                }
                cartTOPass.push(temp);
                
            }
        });
        books.find({ $or: cartTOPass })
            .then((books) => {
                //res.json(books);
                res.render('./public/cart.ejs', { msg: 'items in cart', books: books , key: process.env.KEY_ID });
                //res.json({ books: books });
            });

    }



});
router.post("/api/payment/order", (req, res) => {
    params = req.body;
    var paramsForRazor = {
        amount: params.amount,
        currency: params.currency,
        receipt: params.receipt,
        payment_capture: params.payment_capture
    };
    instance.orders
      .create(paramsForRazor)
      .then((data) => {
        var newOrder = new orderMd({
            userId: params.userId,
            amount: params.amount,
            currency: params.currency,
            receipt: params.receipt,
            payment_capture: params.payment_capture,
            payment_status: params.payment_status,
            product: params.product,
            razorpay_OrderId: data.id
        });

        newOrder.save(function (err) {
            if (err) {
                res.send("database error" + err);
            }
            else {
                console.log('book saved');
                res.send({ sub: data, status: "success" });

            }

        });
      })
      .catch((error) => {
        res.send({ sub: error, status: "failed" });
      });
  });

  router.post("/api/payment/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  
    var expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { status: "failure" };
    if (expectedSignature === req.body.razorpay_signature)
      orderMd.update({razorpay_OrderId: req.body.razorpay_order_id},{payment_status:"success"},function(err, response){
          response = { status: "success" };
          res.send(response);

      });
  });

module.exports = router;