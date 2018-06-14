
  var IO = function(){

    this.init= function () {
      socket.on('connected',function (data) {
              console.log(data.message);
      })

      socket.on('DisplayPlayers',function (data) {
        pot_append(data.players);
        create_table(data.players);
      })

      socket.on('ChatData', function (data) {
        document.getElementById('chat').value+=""+data.name+" : "+data.msg+"\n";
      })

      socket.on('BroadcastGameNum',function (data) {
        document.getElementById('gameNo').textContent="Game Number is : "+String(data.gameNo);
      })

      socket.on('BroadcastRoundNum',function (data) {
        document.getElementById('roundNo').textContent="Round Number is : "+String(data.roundNo);
      })

      socket.on('BroadcastMatchWinner',function (data) {
      document.getElementById("msgbox").textContent=data.name+" Won the Match"
      })

      socket.on('BroadcastPlayerHandWon',function (data) {
        // document.getElementById("log").value+="\n"+data.name+" Won the Hand \n"
        document.getElementById("msgbox").textContent=data.name+" Won the Hand"
        update_hand(data)
      })

      socket.on('BroadcastPlayerClaim',function (data) {
        // document.getElementById("log").value+="\nClaim of Player "+data.name+" is "+data.claim+"\n"
        document.getElementById("msgbox").textContent=" "+data.name+" has Claimed "+data.claim+" hands."
        update_claim(data);
      })

      socket.on('BroadcastPlayerResponse',function (data) {
        display_response(data)
        // document.getElementById("log").value+="\nResponse of Player "+data.name+" is "+data.res.rank+data.res.suit+"\n"
        document.getElementById("msgbox").textContent=" "+data.name+" played "+data.res.rank+" of "+data.res.suit;
      })

      socket.on('showTrump',function (data) {
        var temp=""
        if(data.trump=='0')
          temp="CLUBS"
          else if (data.trump=='1')
            temp="DIAMONDS"
            else if(data.trump=='2')
              temp="SPADES"
                else if(data.trump=='3')
                  temp="HEARTS"
        document.getElementById('trump').value=temp
        document.getElementById('trump').textContent="Trump for this Game is "+temp;
        document.getElementById('trump').style.display = 'block';
      })

      socket.on('playerClaim',function (data) {
        if(game.turn != game.dealer){
          game.claim[game.turn]=parseInt(data.claimValue)
          console.log("claimValue:"+game.turn+data.name+"is"+data.claimValue);
          socket.emit('hostBroadcastPlayerClaim',{gameId:app.gameId,playerNum:game.turn,name:data.name,claim:data.claimValue})
          game.turn=(game.turn+1)%Judgement.players.length;
          Judgement.players[game.turn].getClaim()
      }else{
        var Sum=game.claimSum()
        if(Sum+parseInt(data.claimValue)==game.gameNo)
          Judgement.players[game.turn].getClaim()
        else {
          game.claim[game.turn]=parseInt(data.claimValue)
          socket.emit('hostBroadcastPlayerClaim',{gameId:app.gameId,playerNum:game.turn,name:data.name,claim:data.claimValue})
          console.log("claimValue:"+game.turn+data.name+"is"+data.claimValue);
          game.turn=(game.turn+1)%Judgement.players.length;
          console.log("Claims:"+game.claim);

          console.log("Scores:"+game.score.score);
          App.startRounds()
        }
      }
      })

      socket.on('Response', function (data) {
        console.log("playerResponse"+game.turn+"is"+data.resValue.rank+data.resValue.suit);
        socket.emit('hostBroadcastPlayerResponse',{gameId:app.gameId,name:data.name,id:game.turn,res:data.resValue})
        app.playResponse(data);
      })

      socket.on('getClaim',function (data) {
        // document.getElementById("log").value+="Enter Claim For Your Cards";
        document.getElementById("msgbox").textContent=" Enter Claim For Your Cards"
        app.hostId=data.hostId
      })

      socket.on('getResponse',function (data) {
        // document.getElementById("log").value+="Enter Your Response";
        document.getElementById("msgbox").textContent="Its Your Turn Play!"
        document.getElementById("overlay").style.display='none';
        //app.hostId=data.hostId
      })

      socket.on('showScore',function (data) {
        console.log(data.score);
      })

      socket.on('showCards',function (data) {
        //setInterval(function () {
          App.showCards(data)
          deck_append(data);
          get_response();
          console.log("on showCards");
        //}, 1000)
      })

      socket.on('newGameCreated',function (data) {
        app.hostGameinit(data)
        setInterval(function(){
          socket.emit('activePlayers',{gameId:app.gameId,players:app.players})
        }, 1000);
      })

      socket.on('playerJoinedRoom',function (data) {
        app.players.push(data)
        app.numberofPlayers+=1
        // document.getElementById("log").value+="\nPlayer "+data.playerName+" joined the room"
        document.getElementById("msgbox").textContent=" "+data.playerName+" has joined the room.";

      })

      socket.on('showActivePlayers',function (data) {
        // document.getElementById("Players").value=""
        // app.players=data.players;
        // for(var i in data.players)
          // document.getElementById("Players").value+="\n"+data.players[i].playerName
      })

    }

  }



  var App = function () {
    this.name=""
    this.myRole=""
    //this.gameId=0;
    this.socketid=0;
    this.numberofPlayers=0;
    this.players=[]
    this.hostId=0

    this.init=function () {

    }

    this.hostGameinit= function (data) {
      this.myRole="host";
      this.gameId=data.gameId;
      this.socketid=data.mySocketId;
      this.numberofPlayers=1;

      // document.getElementById("log").value+=" GameID "+data.gameId
      document.getElementById("msgbox").textContent="Your Game ID is: "+data.gameId;
      document.getElementById("gameID").value="GameId is "+data.gameId

    }

    this.playResponse = function (data) {
      var res = Judgement.players[game.turn].play(data.resValue);

      if(game.turn==game.startplayer){
        game.lsuit=res.suit.str;
        game.round.splice(0,0,[res,Judgement.players[game.turn].playerNum])
      }else
        if(res.suit.str==game.lsuit)
          game.round.splice(0,0,[res,Judgement.players[game.turn].playerNum])
        else
          if(Judgement.players[game.turn].hand.hasCardofSuit(game.lsuit)){
            console.log("play the right move!");
            Judgement.players[game.turn].hand.addCard(res)
            console.log(Judgement.players[game.turn].name);
            console.log(Judgement.players[game.turn].hand);
            Judgement.players[game.turn].getResponse();
            return
          }else{
            game.round.splice(0,0,[res,Judgement.players[game.turn].playerNum])
          }

      // game.round[game.turn]=data.resValue
      game.turn=(game.turn+1)%Judgement.players.length;

      if(game.round.length==Judgement.players.length){
        game.getWinner();
      }else {
        Judgement.players[game.turn].getResponse();
      }
    }

  }

  var socket = io();
  var socIO = new IO();
  var app = new App();
  var game = new Judgement();
  socIO.init();
  app.init();
  //var game = require('./js/Judgement');
  App.CreateGame= function () {
    app.name=document.getElementById("name").value;
    document.getElementById('crtbtn').disabled=true;
    document.getElementById('joinbtn').disabled=true;
    app.players.push({gameId:app.gameId,playerName:app.name,mySocketId:socket.id})
    socket.emit("hostCreateNewGame");
    console.log("inside App.CreateGame");
  }

  App.startRounds = function () {
    game.newRound()
  }

  App.JoinGame = function () {
    socket.emit("playerJoinGame",{gameId:document.getElementById("gameID").value,mySocketId:socket.id,playerName:document.getElementById("name").value});
    app.name=document.getElementById("name").value;
    app.gameId=document.getElementById("gameID").value;
    document.getElementById('crtbtn').disabled=true;
    document.getElementById('joinbtn').disabled=true;
    document.getElementById('startGame').disabled=true;
    console.log("inside App.JoinGame");
  }

  App.StartGame = function () {
    game.Addplayers(app.players)
    game.score.initScore();
    document.getElementById('startGame').disabled=true;
    game.startGame()
    console.log('inside App.StartGame');
  }

  App.displayPlayers = function () {
    // for(var p in app.players){
    //   document.getElementById('pot').innerHTML+='<div class="potplayers"></div>'
    // }
  }

  App.showCards = function (data) {
    var temp = new Hand();
    temp.hand=data.hand
    // document.getElementById("log").value+=temp.showHand()
    //document.getElementById("trump").value=
    console.log(temp.showHand())

  }

  App.SendClaim = function () {
    var claim= document.getElementById("claim").value
    socket.emit('playerClaim',{hostId:app.hostId,name:app.name,claimValue:claim,socketId:socket.id})

  }

  App.SendResponse = function () {
    var res={}
    res["rank"]=document.getElementById("responseRank").value
    res["suit"]=document.getElementById("responseSuit").value
    socket.emit('playerResponse',{hostId:app.hostId,name:app.name,resValue:res,socketId:socket.id})
  }


  /*  var socket = io();

    var sendName = function() {
      socket.emit('sendName',{
        name:document.getElementById("text").value
      });
    };

    var ready = function () {
      socket.emit('ready',{
      });
    }
    var response = function () {
      socket.emit('response',{
        rank:document.getElementById("rank").value,
        suit:document.getElementById("suit").value,
      });
      console.log(document.getElementById("response").value);
    }

    socket.on('req',function (data) {
      document.getElementById("log").value+="Its Your Turn Play!!!!"
    })

    socket.on('hand',function(data) {
      document.getElementById("hand").value=data.hand
    })

    socket.on('players',function (names) {
      document.getElementById("log").value="";
      for(var i in names.name){
        document.getElementById("log").value+="Player :"+names.name[i];
        console.log(names.name[i]+"\n");
      }
    }
  );
  */
