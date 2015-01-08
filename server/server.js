var express = require("express"),
	mongoose = require('mongoose'),
	//bodyParser = require('body-parser'),
    server = express(),
    hostname = 'localhost',
    port = 3000; 

server.use(express.static(__dirname + '/../client'));
//server.use(bodyParser.json());
server.listen(port, hostname);
console.log("Server: Express listening: http://" + hostname + ":" + port);

//mongoose connect
mongoose.connect('mongodb://localhost/simple', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('Database: MongoDB connection successful');
    }
});