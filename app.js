const express = require('express') 
const app = express()
var path = require("path");
// var spotcrime = require('spotcrime');


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname+'/bootstrap.min.css'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
