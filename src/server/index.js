var express = require('express');
var bodyParser = require('body-parser')
var socket = require('socket.io');
var _ = require('lodash')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var server = app.listen(8080, function(){
    console.log('server is running on port 8080')
});

var io = socket(server);

var arrOfClients = []


io.on('connection', (socket) => {
    // let url2 = socket.handshake.headers.referer.match(/(\?.*&)/)[0].split('&')[0]
    let url = '?' + socket.handshake.headers.referer.split('?')[1].split('&')[0]
    // console.log(url)
    // console.log(socket.id)

    io.emit('client', {id: socket.id, url: url, clients: Object.keys(socket.nsp.connected)})
    
    socket.on('disconnect', function() {
        console.log('Got disconnected!', socket.id)
        for (var i = 0; i < arrOfClients.length; i++) {
            if (arrOfClients[i].id === socket.id) {
                arrOfClients.splice(i, 1)
            }
        }
        console.log(arrOfClients)
        io.emit('disconnected', socket.id)
     });

    socket.on('clients-to-server', async function(data) {
        console.log('This is data from front-end',data)
        await arrOfClients.push(data);
        var result = _.uniqBy(arrOfClients, await function(e) {
            return e.username;
        });
        arrOfClients = result
        io.emit('server-to-client', arrOfClients)
        console.log('These are all connected clients', arrOfClients)
    })

    socket.on('SEND_MESSAGE', function(data){
        io.to(`${data.recipient}`).emit('RECEIVE_MESSAGE', data);
        io.to(`${data.sender}`).emit('RECEIVE_MESSAGE', data);
    })
});
