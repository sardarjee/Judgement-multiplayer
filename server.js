
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var Judge= require('./app');
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
//app.get('/js/Judgement')
app.use('/client',express.static(__dirname + '/client'));

serv.listen(80, '0.0.0.0');
console.log("Server started.");

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    // socket.id = Math.random();
    // SOCKET_LIST[socket.id] = socket;
    // Player.onConnect(socket);
    Judge.initGame(io, socket);
    //if(Judgement.players.length>0)
    //console.log(Judgement.players.length);
    // socket.on('ready',function () {
    //   counter--;
    //   if(counter==0)
    //     { var judgement = new Judgement();
    //       judgement.getPlayers();
    //       judgement.startGame();
    //     }
    // })
    socket.on('disconnect',function(){

        // delete SOCKET_LIST[socket.id];
        // Player.onDisconnect(socket);
    });
});






//var SOCKET_LIST = {};



/*
Hand.strToCard = function (card) {
  if(card.length == 0)
    return null

		var suit = card[1].toLowerCase() // get the suit from the string

		try{
			var suitIden = suits.indexOf(suit)
    }
    catch(e){
			console.log('Invalid suit')
			return null
    }

		var cardRank = card[0] // get rank from string

		cardRank = cardRank.toUpperCase()


		// convert rank to int
		if(cardRank == "J")
			cardRank = 11
		else
      if(cardRank == "Q")
			   cardRank = 12
		  else
        if(cardRank == "K")
			     cardRank = 13
		    else
          if(cardRank == "A")
			       cardRank = 14
		      else{
            try{
				          cardRank = parseInt(cardRank)
                }
            catch(e){
				          console.log("Invalid card rank.");
				          return null
                  }
          }

      var self = [cardRank,suitIden]

		return self
}
*/


// Player.onConnect = function(socket){
//     counter++;
//     var player = new Player(socket.id,socket);
//     socket.on('sendName',function (data) {
//       player.name=data.name;
//       var names=[]
//       for(var i in Player.list){
//         names.push(Player.list[i].name);
//         //console.log(Player.list[i].name);
//       }
//      for(var i in SOCKET_LIST){
//          var socket = SOCKET_LIST[i];
//          socket.emit('players',{name:names});
//      }
//     })
//
// };
//
// Player.onDisconnect = function(socket){
//     delete Player.list[socket.id];
//     var names=[]
//     for(var i in Player.list){
//       names.push(Player.list[i].name);
//     }
//    for(var i in SOCKET_LIST){
//        var socket = SOCKET_LIST[i];
//        socket.emit('players',{name:names});
//    }
// };




//Judgement.prototype.newGame =
