const express = require('express') 
const app = express()
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
// var spotcrime = require('spotcrime');

app.post('/test', function(req, res) {



    console.log(JSON.stringify(req.body));

    let lat = parseFloat(req.body['lat']);
    let lng = parseFloat(req.body['lng']);

    res.json([
        [lat],
        [lng],
        []
    ]);
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/bootstrap.min.css', function(req, res){
    res.sendFile(path.join(__dirname+'/bootstrap.min.css'));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
