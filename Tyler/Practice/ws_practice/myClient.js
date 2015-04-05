// SECTION 1: Connect to the web socket server.
var ws = new WebSocket('ws://localhost:1234', 'echo-protocol');
// SECTION 2: When the button is pressed, send our message to the server.
function sendMessage(){
    var message = document.getElementById('message').value;
    ws.send(message);
}
// SECTION 3: Listen to a response from the server, add it to the 'chatlog' div that we created.
ws.addEventListener("message", function(e) {
    // The data is simply the message that we're sending back
    var msg = e.data;

    // Append the message
    document.getElementById('chatlog').innerHTML += '<br>' + msg;
});
