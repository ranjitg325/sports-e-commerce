const express = require('express');
var bodyParser = require('body-parser');

const adminRoute = require('./route/admin');
const brandRoute = require("./route/brand");
const cartRoute = require("./route/cart");
const productRoute = require("./route/product");
const storeRoute = require("./route/store");
const subAdminRoute = require("./route/subAdmin");
const userRoute = require("./route/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://api_client:metaverse-client@metaverseapi.ehc3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/admin', adminRoute);
app.use('/brand',brandRoute);
app.use('/cart',cartRoute);
app.use('/product',productRoute);
app.use('/store',storeRoute);
app.use('/subAdmin',subAdminRoute);
app.use('/user',userRoute);

app.listen( 3000, function () {
    console.log('Express app running on port ' + (3000))
});