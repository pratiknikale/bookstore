var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var books = require('../public/models/books_model.js');
var orderMd = require('../public/models/order_model.js');

router.get('/',function(req,res){
    orderMd.find({userId:1})
    .then((orders)=>{
        //res.json(books);
        // req.session.page=2;
        res.render('./public/orders.ejs',{orders:orders});
    });
});

module.exports = router;