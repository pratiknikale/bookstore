var express = require('express');
var router = express.Router();
var session = require('express-session');

var books = require('../public/models/books_model.js');

router.get('/', function (req, res) {
    books.find({})
    .then((books)=>{
        //res.json(books);
        // req.session.page=2;
        var iBtn=req.query.page?req.query.page:1
        iBtn = parseInt(iBtn)
            res.render('./public/home.ejs',{ books : books,page:iBtn});
    });
});

router.get('/:genre', function (req, res) {

    books.find({genre: req.params.genre})
    .then((books)=>{
        var iBtn=req.query.page?req.query.page:1

        //res.json(books);
        res.render('./public/home.ejs',{ books : books ,page:iBtn});
    });
    
});






module.exports = router;