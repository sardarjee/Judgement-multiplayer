function Scoreboard(){
  this.score = []

  for(var i in Player.list)
    this.score.push(0);

  this.showScore = function() {
    console.log(this.score);
  }
  this.updateScore = function(index,val) {
    this.score[index]+=val
  }
  this.displayWinner= function() {
    return this.score.indexOf(Math.max(...this.score));
  }
}
