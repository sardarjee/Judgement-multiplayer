
  var IO = function(){

    this.init= function () {
      socket.on('connected',function (data) {
              console.log(data.message);
      })

      socket.on('ValidClaim',function () {
        alert("Enter Valid Claim");
      })

      socket.on('DisplayPlayers',function (data) {
        pot_append(data.players);
        create_table(data.players);
      })

      socket.on('BroadcastClearPot',function (data) {
        clear_pot(data);
      })

      socket.on('UndoLastTurn',function (data) {
        alert("Play a Valid Move!!");
        card_append(data);
      })

      socket.on('ClearLastTurn',function (data) {
        document.getElementById('msgbox').textContent="Wait for Your Turn";
        clear_last_turn(data);
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
        document.getElementById("msgbox").textContent=data.name+" Won the Hand";
        document.getElementById("chat").value+="\n"+data.name+" Won the Hand\n\n";
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
        document.getElementById('form').style.display='none';
        document.getElementById('claimTableHead').style.display = 'block';
        document.getElementById('claimTable').style.display = 'inline-table';
      })

      socket.on('playerClaim',function (data) {
        if(game.turn != game.dealer){
          game.claim[game.turn]=parseInt(data.claimValue)
          console.log("claimValue:"+game.turn+data.name+"is"+data.claimValue);
          socket.emit('hostBroadcastPlayerClaim',{gameId:app.gameId,playerNum:game.turn,name:data.name,claim:data.claimValue})
          game.turn=(game.turn+1)%Judgement.players.length;
          Judgement.players[game.turn].getClaim()
      }else{
        var Sum=game.claimSum();
        console.log("Sum="+Sum);
        if(Sum+parseInt(data.claimValue)==game.gameNo){
          socket.emit("hostValidClaim",{socketId:Judgement.players[game.turn].id})
          Judgement.players[game.turn].getClaim()

        }
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
        document.getElementById("claimbtn").disabled=false;
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
        console.log(data.players);
        show_score(data);
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
        socket.emit('activePlayers',{gameId:app.gameId,players:app.players});
        app.numberofPlayers+=1
        switch (app.players.length) {
          case 5:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="10">10</option><option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
          case 6:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
          case 7:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
          case 8:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
          case 9:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
          case 10:{
            $('#selectGame').empty();
            $('#selectGame').append('<option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>');
                break;
          }
        }
        // document.getElementById("log").value+="\nPlayer "+data.playerName+" joined the room"
        document.getElementById("chat").value+=data.playerName+" has joined the Match.\n";
        document.getElementById("msgbox").textContent=" "+data.playerName+" has joined the Match.\n";

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
      document.getElementById("msgbox").textContent=data.gameId;
      document.getElementById("gameID").value=data.gameId

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
            socket.emit('hostUndoLastTurn',{socketId:Judgement.players[game.turn].id,rank:data.resValue.rank,suit:data.resValue.suit})
            socket.emit("hostBroadcastClearLastTurn",{gameId:app.gameId,id:game.turn});
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
    document.getElementById('selectGame').disabled=false;
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
    document.getElementById("msgbox").textContent="Wait for the Host to Start Game";
    document.getElementById('crtbtn').disabled=true;
    document.getElementById('joinbtn').disabled=true;
    document.getElementById('startGame').disabled=true;
    document.getElementById('selectGame').style.display='none';
    console.log("inside App.JoinGame");
  }

  App.StartGame = function () {
    if(app.players.length>1){
    game.Addplayers(app.players)
    game.score.initScore();
    document.getElementById('startGame').disabled=true;
    document.getElementById('selectGame').disabled=true;
    game.gameNo=parseInt(document.getElementById('selectGame').value);
    game.startGame()
  }else {
    alert("Wait for other Players to join");
  }
    console.log('inside App.StartGame');
  }

  // App.displayPlayers = function () {
  //   // for(var p in app.players){
  //   //   document.getElementById('pot').innerHTML+='<div class="potplayers"></div>'
  //   // }
  // }

  App.showCards = function (data) {
    var temp = new Hand();
    temp.hand=data.hand
    console.log(temp.showHand())

  }

  App.SendClaim = function () {
    var claim= document.getElementById("claim").value
    document.getElementById("claimbtn").disabled=true;
    socket.emit('playerClaim',{hostId:app.hostId,name:app.name,claimValue:claim,socketId:socket.id})

  }

  App.SendResponse = function () {
    var res={}
    res["rank"]=document.getElementById("responseRank").value
    res["suit"]=document.getElementById("responseSuit").value
    socket.emit('playerResponse',{hostId:app.hostId,name:app.name,resValue:res,socketId:socket.id})
  }
