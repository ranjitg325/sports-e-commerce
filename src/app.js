const express = require('express');
var bodyParser = require('body-parser');

const route = require('./route/route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://api_client:metaverse-client@metaverseapi.ehc3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen( 3000, function () {
    console.log('Express app running on port ' + (3000))
});