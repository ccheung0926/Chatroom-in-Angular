var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var name = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/chatAngular.html');
});
app.use('/', express.static(path.join(__dirname, '/')));

io.on('connection', function(socket){
  //server listen to the emitted message from client
  socket.on('clientToSeverMsg', function(data){
    console.log('hi', JSON.stringify(data));
    //send msg to everyone BUT the sender
    socket.broadcast.emit('severToClientMsg', data);
  });
  socket.on('clientToSeverGetName', function(data){
    if(name.indexOf(data) === -1){
      name.push(data);
    }
    console.log('clientToSeverGetName', data)
    // socket.broadcast.emit('severToClientGiveName', name);
    io.emit('severToClientGiveName', name);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});