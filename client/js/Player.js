//Player.js
var Player = function(iden,name){
    this.name = name
    this.id = iden
    this.score = 0
    this.hand = new Hand()
    this.playerNum = 0
    //this.socket=socket
    //Player.list[this.id] = this;
    this.respond = false

    this.getClaim = function () {
      socket.emit('hostGetClaim',{gameId:app.gameId,hostId:app.socketid,socketId:this.id})
    }
    this.addCard = function(card) {
      this.hand.addCard(card)
    }

    this.getResponse = function() {
      socket.emit('hostGetResponse',{gameId:app.gameId,hostId:app.socketid,socketId:this.id})
      // var res={}
      // this.socket.emit('req',{data:"Hello"})
      // console.log(this.name);
      //
      // if(this.respond==false){
      //   this.socket.on('response', function (data) {
      //       //Player.response.push({this.id,String(data.response)})
      //       res=data
      //       console.log("Response :  "+res);
      //       this.respond=true
      //   });
      // }
      // return new Promise(resolve => {
      //   setTimeout(() => {
      //        resolve(res);
      //      }, 26000);
      // });
}
    this.play =  function(input) {
      var card=Card(input["rank"],input["suit"])
      this.removeCard(card)
      return card
    }

    this.clearCards = function () {
      this.hand = new Hand()
    }

    this.hasSuit = function (suit) {
      return this.hand.hand[suit.id].length > 0
    }

    this.removeCard= function (card) {
        this.hand.removeCard(card)
    }

}


//Player.list = {};
Player.response=[];
