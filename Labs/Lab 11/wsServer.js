var util = require('util');
var path = require('path');
var fs = require('fs');
var readline = require('readline');
var io = require('socket.io').listen(5000);

console.log("Listening on port 5000");

var usersOnline = [];
var postsList =[];

function initializeServer(){
    //Set file path.
    var file = path.normalize('.'+'/posts.txt');

    //Check if file exists
    fs.exists(file, function(exists) {
        if (exists){
            // Open and configure read stream.
            var rs = fs.createReadStream(file);
            rs.setEncoding("utf-8");
            
            // Configure readline
            var rl = readline.createInterface({
                input : rs
            });
            
            // Error handler.
            rs.on('error', function() {
                console.log("Error 500: Internal Server Error"); 
            });
            
            console.log("\nREADING POSTS.TXT");
            // Read file line by line.
            rl.on('line', function(line){
                // Store line in JSON obj.
                var postJSON = JSON.parse(line);
                console.log("\n   NEW LINE:\n   "+JSON.stringify(postJSON));
                var duplicate = false;
                // Check if JSON with same id is already in list.
                for (var item in postsList){
                    //If so, console.log it and ignore it for now.
                    if (postsList[item].id == postJSON.id){
                        console.log("\n   Duplicate id (id :"+postJSON.id+") found in posts.txt.");
                        duplicate = true;
                    }
                }
                // If this json doesn't have a duplicate id, add it to the list.
                if (!duplicate) {
                    postsList.push(postJSON);
                }              
            });
            
            // At end of file read-in. 
            rs.on('end', function() {
                console.log("\nREACHED END OF POSTS.txt");
                console.log("\n   postsList pre-sort:\n      "+JSON.stringify({"posts": postsList}));

                // Sort the posts by timestamp.
                postsList.sort(function(a,b){

                        var date1 = new Date(a.timestamp).getTime();

                        var date2 = new Date(b.timestamp).getTime();

                        return date1 - date2;
                });
                
                // Set the id of each post to match 
                // the index it belongs to
                for(var item in postsList){
                    postsList[item].id=item;
                }               
                console.log("\n   postsList post-sort:\n     "+JSON.stringify({"posts": postsList}));
                //TODO: 
                //Clear contents of posts.txt and re-write the updated postsList line by line.
                
            });
        }
        else {
            console.log("Error 404: File could not be found.");
        }
    });
    
}

initializeServer();


io.sockets.on('connection', function(socket) {
    console.log("Connection has been established.");

    var thisUsername = "";
    
    // DONE
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

    // TODO: SENDS DATA TO LOGGED-IN CLIENT TO SUFFICIENTLY INITIALIZE THE PAGE CONTENTS
    // incoming JSON: {"username" : ...}
    socket.on('loadData', function(content) {
        var data;
        updateListOfPosts();
        //socket.emit('initializePage', data);
    });
    
    // TODO: HANDLES A NEW POST SENT FROM A CLIENT
    // incoming JSON: {"author": ..., "data": ..., "timestamp": ...}
    socket.on('newPost', function(content) {
			// Open posts.txt file.
			var file = path.normalize('.'+'/posts.txt');
			// Open write stream.
        
        // Write new post to posts.txt
			
        // Add post to the postsList array.
        // Sort posts
        var id = postsList.length;
        var newJSON = {"id":id,"author":content.author,"data":content.data,"timestamp":content.timestamp};
        postsList.push(newJSON);
		fs.appendFile(file,'\r\n' + JSON.stringify(newJSON), encoding='utf8', function(err){
				if(err) throw err;
			});
        // Emit an updatePostList for all users.
        updateListOfPosts();
        //io.sockets.emit('updatePostList', data);
    });
    
    // TODO: HANDLES AN EDIT POST REQUEST SENT FROM CLIENT
    // incoming JSON: {"id": ..., "author": ..., "data": ..., "timestamp": ...}
    socket.on('editPost', function(content) {
        // Convert timestamp to index
		for(var i = 0; i < postsList.length; i++){
			if(postsList[i].id === content.id){
				postsList[i].data = content.data;
			}
		}
		
		var file = path.normalize('.'+'/posts.txt');
		
		fs.writeFile(file, JSON.stringify(postsList), "utf8", function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log("Success");
				}
			});
		
    });
    
    // DONE
    // incoming JSON: {"username": ...}
    socket.on('logout', function(content) {
        var username = JSON.parse(content).username;
        var index = usersOnline.indexOf(username);
        delete usersOnline[index];
        console.log("Client has logged out.");
        updateListOfOnlineUsers();
    });
    
    //DONE
    socket.on('disconnect', function(){
        var index = usersOnline.indexOf(thisUsername);
        if (index!==-1){
            delete usersOnline[index];
            updateListOfOnlineUsers();
            console.log("Client removed from list of users online.");
        }
        console.log("Client has been disconnected.");
    });
    
    socket.on('error', function(err){
        console.log(err);
    });
    //DONE
    function updateListOfPosts(){
        var data = {"posts":[]};
        for (var item in postsList){
            data["posts"].push(postsList[item]);
        }
        data = JSON.stringify(data);
        io.sockets.emit('updatePostList', data);
    }
    //DONE
    function updateListOfOnlineUsers(){
        var data = {"onlineUsers":[]};
        for (var item in usersOnline){
            data["onlineUsers"].push(usersOnline[item]);
        }
        data = JSON.stringify(data);
        io.sockets.emit('updateOnlineUsersList', data);
    }
});