var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('line', lineMsg);

    function lineMsg(data) {
        socket.broadcast.emit('line', data);
        console.log(data);
    }
}