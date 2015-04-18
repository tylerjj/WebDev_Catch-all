var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var clients = [];

var server = http.createServer(function(request, response) {
});
server.listen(1234, function() {
    console.log((new Date()) + " Server is listening on port 1234");
});

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request){
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin); 
    var index = clients.push(connection) - 1;
	console.log((new Date()) + ' Connection accepted.');
	//for (var i=0; i < clients.length; i++) {
                    //broadcast to all current connected users that someone has just logged in
    //            }
	connection.on('message', function(message){
		if(message.type === 'utf8'){
			console.log((new Date()) + ' Received Message from '
                            + userName + ': ' + message.utf8Data);
                
                var obj = {
                    time: (new Date()).getTime(),
                    text: message.utf8Data,
                    author: userName,
                };
			var json = JSON.stringify({ type:'message', data: obj });
			//open and read the file "post.txt"
			//write the latest post into "post.txt"
			fs.appendFile('post.txt', json, function (err) {
				if (err) throw err;
			});
		}
	});
});