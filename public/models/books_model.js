var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    bookname: String,
    author: String,
    genre: String,
    cover: String,
    info: String,
    price: Number
});

module.exports = mongoose.model("books", bookSchema);