//SECTION 1: Create server and listen.
//
// A. CREATE SERVER
//
//	a1. We need to require the 'http' library, and then create a new server.
var http = require('http');

//  a2. We're using an empty function within the createServer, as we're not
//      actually serving anything through the HTTP request.
var server = http.createServer(function(request, response){});

// B. LISTEN ON PORT '1234'
//
//  b1. We need to tell this server to listen on a particular port, for fun
//      we'll use the port '1234'
//  b2. The first parameter here is the port that we want to listen to, and 
//      the second is a callback function that tells us that we're connected.
server.listen(1234, function() {
	console.log((new Date()) + ' Server is listening on port 1234');
});

// END OF SECTION 1: We now have a server that's running and 
//					 listening on port 1234. We now need to
//					 use this to create our WebSocket Server.

// SECTION 2: Create a Web Socket Server.
//
// A. CREATE WEBSOCKET SERVER

//	a1. We need to create the Web Socket Server on the back of the HTTP server
//		that we created. 
//	a2. We need to require the websocket library to do this.
var WebSocketServer = require('websocket').server;
wServer = new WebSocketServer({
	httpServer : server
});

// END OF SECTION 2: We now have a web socket server that is 
//					 running, and available for us to start 
//					 adding some event listeners. In this 
//					 case, we want to add one for when a new
//					 request to join is made. 

// SECTION 3: Listening for Connections
//
// A. LISTEN FOR CONNECTIONS
//	a1. We need to create an object that will store the client connections, as well
//		as an incrementing number to identify each client. These must sit outside 
//		the event listener.
var count = 0;
var clients = {};

//  a2. We use the '.on' method within the WebSocketServer object that we have
//      created previously, listening for the event 'request'. We then provide 
//		a callback where we will then put all of our code which will execute 
//		when someone joins to the socket server. 
wsServer.on('request', function(r)
{
	//SECTION 4: Callback for connections
	//
	// A. ACCEPT THE CONNECTION
	//	a1. We must accept the connection before we can do anything with it. This
	//		gives us an object that represents that client's connection. 
	//	a2. We're going to use the 'echo-protocol' for the connection, and using
	//		the 'accept' method within the 'request' object that is passed into
	//		the callback as a parameter (which we have identified as 'r')
	var connection = r.accept('echo-protocol', r.origin);
	//	a3. Now we can use this connection to send messages to the client, or add 
	//		specific listeners for the client etc. 
	
	// B. STORE CONNECTED CLIENTS
	//	b1. We need to store the 'id' for this client, and cache their connection.
	var id = count++;
	clients[id] = connection;
	console.log((new Date()) + ' Connection accepted [' + id + ']');
	
	// C. LISTEN FOR INCOMING MESSAGES AND BROADCAST MESSAGES TO CLIENTS
	//
	//	c1. We attach an event listener to the connection for when we get a message from 
	//		the client to the server.
	connection.on('message', function(message) 
	{
		// c2. We take the message that was sent to us and we send it out to every 
		//	   other client that is connected.
		
		// The string message that was sent to us
		var msgString = message.utf8Data;
		// Loop through all clients
		for(var i in clients){
		
			// c3. Realistically, we'd rather send a JSON to the other clients, instead
			//	   of a simple message string. 
			
			// Send a message to the client with the message
			clients[i].sendUTF(msgString);
		}
	});
	// D. LISTEN FOR CLIENT DISCONNECTING AND REMOVE FROM LIST OF CLIENTS}
	//
	// 	d1. We need to listen for the 'close' event, and then delete the disconnecting 
	//		client from the client storage object.
	connection.on('close', function(reasonCode, description) {
		delete clients[id];
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
	// END OF SECTION 4: We now have a basic system setup on the server side that should
	//					 accept web socket connections and broadcast our message out to every
	//					 connected client. This is the end of the back end.
}
// END OF SECTION 3: We now move on to the bulk of code that
//					 will fit within these connections.