var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var api = require('./api');
const PORT =  8011;

var conn = function() {
  server.listen(PORT);

  app.get('/api', function (req, res) {
    console.log('api woprking');
    //res.sendfile(__dirname + '/index.html');
  });
};

var fromClient = function() {

io.on('connection', function (socket) {
  
  socket.on('fromClient', function (data) {
    console.log(data.client);
         api.getRes(data.client).then(function(res){

            console.log('server', res);
            console.log('client', data.client)

            socket.emit('fromServer', { server: res });
         });
  });
});
}
module.exports = {conn,fromClient}
