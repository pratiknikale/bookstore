var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var upload = multer();
var app = express();
var admin = require('./routes/admin.js');
var home = require('./routes/home.js');
var cart = require('./routes/cart.js');
var orders = require('./routes/orders.js')
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pratikN:ROLLno256@cluster0.5bld3.mongodb.net/bookstore?retryWrites=true&w=majority');
var session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');

dotenv.config();
const instance = new Razorpay({
   key_id : process.env.KEY_ID,
   key_secret : process.env.KEY_SECRET,
});

//middlewares
app.use(session({secret: "admn123"}));
app.use(cors());

app.engine('html', require('ejs').renderFile);                  //engine used to access html files
app.set('views', __dirname);

app.use(express.static('public')); 
var dir = path.join(__dirname,'uploads');                            //
app.use('/uploads',express.static(dir));                            //static files

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 
//form-urlencoded

// for parsing multipart/form-data
//app.use(upload.array()); 
app.use(express.json());                                        //for sending post data abpve express version 4
                                                                //sxpress.json in used
app.get('/', function(req, res){
   res.send("Hello world!");
});
app.use('/admin', admin);
app.use('/home', home);
app.use('/cart', cart);
app.use('/orders', orders);
app.listen(3000);
