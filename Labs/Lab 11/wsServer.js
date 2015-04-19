var util = require('util');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var io = require('socket.io').listen(5000);

console.log("Listening on port 5000");

var usersOnline = [];
io.sockets.on('connection', function(socket) {
    console.log("Connection has been established.");

    //TODO: SET USERNAME VARIABLE OUT HERE. On connection closed, emit logout from close handler
    var thisUsername = "";
    
    // Check login information against users.txt.
    socket.on('validateLogin', function(content) {
        // Take in a {username: ..., password: ...} JSON.
        var loginJSONObj = JSON.parse(content);
        
        var match = false;
        
        var file = path.normalize('.'+'/users.txt');
        
        // Check if file exists.
        fs.exists(file, function(exists) {
            if (exists) {
                var rs = fs.createReadStream(file);
                rs.setEncoding("utf-8");
                var rl = readline.createInterface({
                    input : rs
                });
                rs.on('error', function() {
                    console.log("Error 500: Internal Server Error"); // error status
                });
                rl.on('line', function(line){
                    console.log("READ LINE FROM STREAM");
                    var userJSON = JSON.parse(line);
                    console.log("Current line of users.txt: ");
                    console.log(JSON.stringify(userJSON));
                    if (content.trim() == JSON.stringify(userJSON)){
                        console.log("A match has been found");
                        thisUsername=userJSON["username"];
                        if (usersOnline.indexOf(thisUsername)==-1){
                            usersOnline.push(userJSON["username"]);
                        }
                        match = true;
                    }
                });
               rs.on('end', function() {
                   console.log("DONE READING STREAM OF DATA");
                    if (match){
                        // On success, emit success response.
                        console.log("Sending success response back.");
                        socket.emit('loginResponse', true);
                        updateListOfOnlineUsers();
                    } else {
                        console.log("Sending failure response back.");
                        // Otherwise, emit failure response.
                        socket.emit('loginResponse', false);
                    }
                });
            }
            else {
                console.log("Error 404: File could not be found.");
                // Emit failure response.
                socket.emit('loginResponse', false);
            }
        });
    });

    socket.on('loadData', function(content) {
        // add client's username to 
        var data;
        socket.emit('initializePage', data);
    });
    
    socket.on('updatePost', function(content) {
        var data;
        socket.emit('updatePostList', data);
    });
    
    socket.on('logout', function(content) {
        var username = JSON.parse(content).username;
        var index = usersOnline.indexOf(username);
        delete usersOnline[index];
        console.log("Client has logged out.");
        updateListOfOnlineUsers();
    });
    
    socket.on('disconnect', function(){
        var index = usersOnline.indexOf(thisUsername);
        if (index!==-1){
            delete usersOnline[index];
            updateListOfOnlineUsers();
            console.log("Client removed from list of users online.");
        }
        console.log("Client has been disconnected.");
    });
    function updateListOfOnlineUsers(){
        var data = {"onlineUsers":[]};
        for (var item in usersOnline){
            data["onlineUsers"].push(usersOnline[item]);
        }
        data = JSON.stringify(data);
        io.sockets.emit('updateOnlineUsersList', data);
    }
});