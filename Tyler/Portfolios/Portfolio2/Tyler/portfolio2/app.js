var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: app.listen(1234)
});
                            
var count = 0;
var clients = {};
                            
wsServer.on('request', function(r)
{
    //8. Accept and save the connection.
	var connection = r.accept('echo-protocol', r.origin);
	//9. Set an id for the new connection, and increment count.
	var id = count++;
	//10. Store connection in our set of clients. 
	clients[id] = connection;
	console.log((new Date()) + ' Connection accepted [' + id + ']');
	
	//11. Ask our connection to listen for messages from the client.
	connection.on('message', function(message) 
	{	
		//11.1 get message's utf8Data value
		var msgString = "Client["+id+"]: "+message.utf8Data;
		
		//11.2 Send the message received to all clients.
		for(var i in clients){
			clients[i].sendUTF(msgString);
		}
	});
	
	//12. Ask our connection to listen for if it has been closed. 
	connection.on('close', function(reasonCode, description) {
		// 12.1 Delete this connection from our set of clients.
		delete clients[id];
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
