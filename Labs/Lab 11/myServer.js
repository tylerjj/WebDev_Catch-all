//1. Require http module
var http = require('http');
//2. Create http server.
var server = http.createServer(function(request, response){});

server.listen(4000);

var io = require('socket.io').listen(5000);

io.sockets.on('connection', function(socket) {
    
    socket.on('validateLogin', function(content) {

    });

    socket.on('loadPage', function(content) {
        
    });
    
    socket.on('updatePost', function(content) {
        
    });
    
    socket.on('logout', function(content) {
      
    });
    
    socket.on('updatePost', function(content) {
        
    });
});
