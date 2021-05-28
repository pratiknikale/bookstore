var express = require('express');
var router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage });

var mongoose = require('mongoose');
var books = require('../public/models/books_model.js');



router.get('/', function (req, res) {
    res.render('./public/admin.html');
});

router.post('/data', upload.single('cover'), function (req, res) {

    if (!req.body.bookname || !req.body.author || !req.body.genre || !req.body.info  || !req.body.price) {
        res.status('400');
        res.render('./public/admin.html');
    }
    else {

        books.findOne({ bookname: req.body.bookname }).then(book => {
            if (book) {
                console.log('book exist error');
                // Users.find(function (err, response) {
                //     res.json(response);
                // });

                res.render('./public/admin.html');
            }
            else {
                var newBook = new books({
                    bookname: req.body.bookname,
                    author: req.body.author,
                    genre: req.body.genre,
                    cover: req.file.filename,
                    info: req.body.info,
                    price: req.body.price
                });

                newBook.save(function (err, user) {
                    if (err) {
                        res.send("database error" + err);
                    }
                    else {
                        console.log('book saved');
                        // books.find(function (err, response) {
                        //     res.json(response);
                        // });
                        // req.session.user = newUser;
                        res.redirect('/home');
                    }

                });
            }
        })
    }
});

//export this router to use in our index.js
module.exports = router;