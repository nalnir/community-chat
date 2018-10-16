var express = require('express');
var bodyParser = require('body-parser')
var socket = require('socket.io');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

var io = socket(server);


io.on('connection', (socket) => {

    io.emit('client', socket.id)
    console.log(Object.keys(socket.nsp.connected))
    io.emit('allClients', Object.keys(socket.nsp.connected))

    socket.on('SEND_MESSAGE', function(data){
        console.log(data.recipient)
        io.to(`${data.recipient}`).emit('RECEIVE_MESSAGE', data);
        io.to(`${socket.id}`).emit('RECEIVE_MESSAGE', data);
    })
    socket.on('disconnect', function() {
        console.log('Got disconnected!', socket.id)
        io.emit('disconnected', socket.id)
     });
});
