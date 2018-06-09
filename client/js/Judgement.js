function Judgement() {
 this.dealer = -1
 this.startplayer = -1
 this.deck = new Deck();
 //self.players = [Player("Danny",0), Player("Desmond",1), Player("Ben",2), Player("Tyler",3)]
 //self.players = [Player("Danny",0), Player("Desmond",1)]
 this.score = new Scoreboard()
 this.trump = Math.floor(Math.random() * Math.floor(4))
 this.NumGames = 1//52/len(self.players)
 this.gameNo = 1//NumGames

 this.Addplayers = function(data){
   for (var i in data){
   var player= new Player(data[i].mySocketId,data[i].playerName)
   Judgement.players.splice(0,0,player)
 }
   for(var i =0;i<Judgement.players.length;i++)
     Judgement.players[i].playerNum=i;

  console.log("after Addplayers"+ Judgement.players.length);
 }

 this.startGame= async function() {
   //while(this.NumGames != 0){
       await this.newGame()
       console.log("after newGame");
       // this.NumGames = this.NumGames-1
       // this.gameNo = this.gameNo-1
   //}
   //this.showWinner()
   console.log("after startGame");
 }


 this.newGame=async function () {
 this.deck = new Deck()
 this.deck.shuffle()
 this.dealer = (this.dealer + 1) % Judgement.players.length
 this.dealCards()
 this.showTrump()
 this.showScore()
 // this.Show()
 this.gamescore=[]
 for(var i =0;i<Judgement.players.length;i++)
    this.gamescore.push(0);
 this.startplayer=this.dealer+1
 this.claim = []
 this.turn=this.startplayer;
 this.getClaim()
 this.roundCount=0


 // for(var i=0;i<this.gameNo;i++){
 //     this.startplayer= await this.newRound()
 //     console.log("after new Round");
 //     Gamescore[this.startplayer]+=1
 //   }
 // this.UpdateScoreboard(this.claim,Gamescore)
 }

 // this.getPlayers = function () {
 //
 // }

 this.dealCards = function () {
   var cardsDealt = this.gameNo *Judgement.players.length
   var i = 0
   while(cardsDealt != 0){
       Judgement.players[i % Judgement.players.length].addCard(this.deck.deal())
       i += 1
       cardsDealt=cardsDealt-1
   }
   this.showCards();
   //socket.emit("hostShowCards",{gameId:app.gameId});
 }

 this.showCards = function () {
   for(var v in Judgement.players){
      socket.emit("hostShowCards",{gameId:app.gameId,socketId:Judgement.players[v].id,hand:Judgement.players[v].hand.hand,trump:this.trump})
   }
 }

 this.showTrump = function () {
   socket.emit('hostShowTrump',{gameId:app.gameId,trump:this.trump})
 }

 this.showScore =function() {
   socket.emit('hostShowScore',{gameId:app.gameId,score:this.score.score})
 }

 // this.Show = function() {
 //   for(var p in Judgement.players){
 //     //sockets
 //     Judgement.players[p].socket.emit('hand',{
 //       hand:Judgement.players[p].hand.showHand()
 //     })
 //   console.log(Judgement.players[p].name+String(Judgement.players[p].playerNum)+":");
 //   console.log(Judgement.players[p].hand.showHand());
 //   console.log("The trump is "+String(this.trump)+"\n0: clubs\n1: diamonds\n2: spades\n3: hearts");
 //   this.score.showScore()
 //   }
 // }

 this.getClaim = function() {
   for(var i in Judgement.players)
           this.claim.push(0);
   // for(var i=1;i<Judgement.players.length+1;i++)
   //     claim[(this.dealer + i) % Judgement.players.length] = 0//Judgement.players[(this.dealer + i) % Judgement.players.length].getClaim()//Socket get claim//raw_input("Enter Cliam for "+str(self.players[(self.dealer + i) % len(self.players)].name)+str((self.dealer + i) % len(self.players))+" ")
   // return claim
   this.turn=(this.dealer + 1) % Judgement.players.length
   Judgement.players[this.turn].getClaim()
 }

 this.claimSum = function () {
   var temp=0;
   for(var i in this.claim)
    temp+=this.claim[i]

    return temp
   }

 this.newRound= async function() {
   this.round = []
   this.lsuit = ""
   Judgement.players[(this.startplayer) % Judgement.players.length].getResponse();
}
 //   for(var i=0;i<Judgement.players.length;i++){
 //       while(true){
 //           var input = await Judgement.players[(this.startplayer + i) % Judgement.players.length].getResponse();
 //           console.log("after get Response");
 //           var res = Judgement.players[(this.startplayer + i) % Judgement.players.length].play(input);
 //           if(i==0){
 //               suit=res.suit.string
 //               round.splice(0,0,[res,Judgement.players[(this.startplayer + i) % Judgement.players.length].playerNum])
 //               break
 //           }
 //           if(res.suit.string==suit){
 //               round.splice(0,0,[res,Judgement.players[(this.startplayer + i) % Judgement.players.length].playerNum])//inset at o
 //               break
 //           }
 //           else{
 //
 //               if(Judgement.players[(this.startplayer + i) % Judgement.players.length].hand.hasCardofSuit(suit)){
 //                   console.log("play the right move!");
 //                   Judgement.players[(this.startplayer + i) % Judgement.players.length].hand.addCard(res)
 //                   console.log(Judgement.players[(this.startplayer + i) % Judgement.players.length].name);
 //                   console.log(Judgement.players[(this.startplayer + i) % Judgement.players.length].hand);
 //                   continue
 //                 }
 //               else{
 //                   round.splice(0,0,[res,Judgement.players[(this.startplayer + i) % Judgement.players.length].playerNum])
 //                   break
 //               }
 //           }
 //         }
 //   }
 //   var win =this.getWinner(round,suit)
 //   return new Promise(resolve=> {
 //     setTimeout(() => {
 //     resolve(win)
 //     }, 10);
 //   });
 // }
 //
 this.getWinner = function () {

    var win = this.round[Judgement.players.length-1]
    var tflag=0
    if(win[0].suit.iden==this.trump)
        tflag=1
    for(var card in this.round){
        if(this.round[card][0].suit.iden==this.trump){
            if(tflag==1){
                if(this.round[card][0]>win[0])
                    win=card
                else
                    continue
            }
            else{
                tflag=1
                win=this.round[card]
            }
        }
        else{
            if(tflag==1)
                continue
            else{
                if(this.round[card][0].suit.string==this.lsuit){
                    if(this.round[card][0]>win[0])
                        win=card
                    else
                        continue
                  }
                else
                    continue
              }
          }
    }
    console.log("Player "+String(win[1])+" won the hand!");
    this.startplayer=win[1]
    this.lsuit=""
    this.round=[]
    this.gamescore[this.startplayer]+=1;
    this.roundCount+=1
    if(this.roundCount==this.gameNo)
    {
      this.gameNo=this.gameNo-1
      if(this.gameNo==0){
        this.UpdateScoreboard()
        this.showWinner()
      }
      else {

          this.UpdateScoreboard()
          this.newGame();
        }
    }

 }

 this.UpdateScoreboard = function(){
   for(var i=0;i<Judgement.players.length;i++){
       if(parseInt(this.claim[i])==this.gamescore[i]){
           if(this.gamescore[i]==0){
               this.score.updateScore(i,10)
               continue
           }
           this.score.updateScore(i,parseInt(this.claim[i])*10+parseInt(this.claim[i]))
       }
   }
   //this.Show()
 }

 this.showWinner = function() {
   console.log("Winner is "+String(Judgement.players[this.score.displayWinner()].name));
 }

}

Judgement.players=[];
