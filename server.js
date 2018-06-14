var express = require('express');
var app = express();
var port = 8080;
var serv = require('http').Server(app);
var Judge= require('./app');
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
// app.listen(process.env.PORT||port, () => {
//  console.log("Server listening on port " + port);
// });
serv.listen(process.env.PORT||port, () => {
 console.log("Server listening on port " + port);
});
// console.log("Server started.");

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    Judge.initGame(io, socket);
    socket.on('disconnect',function(){
    });
});
