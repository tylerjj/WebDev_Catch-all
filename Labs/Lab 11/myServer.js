var util = require('util');
var http = require('http');
var path = require('path');
var fs = require('fs');

var server = http.createServer();
server.listen(4000);

console.log("Server is listening.");
