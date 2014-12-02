
var express = require('express');

var app = express();

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());


/*app.get('/', function(req, res){
	res.send("Hi");
   //res.sendFile(__dirname + '/main.html');
}); */

app.listen(3000, function(){
    console.log("PORT 3000");
});
