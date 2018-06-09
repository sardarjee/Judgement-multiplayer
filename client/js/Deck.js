//Deck.js
var numSuits = 4
var minRank = 2
var maxRank = 15

function Deck() {
  var dec = []
  for(var suit=0; suit<numSuits;suit++){
    for(var rank= minRank;rank<maxRank;rank++)
      dec.push(Card(rank,suit));
  }



  this.showDeck = function () {
    var temp=""
    for(var i=0;i<dec.length;i++)
      temp+=dec[i].rank.str+dec[i].suit.str+" "
    console.log(temp);
  }

  this.shuffle = function () {
    var currentIndex = dec.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    var temporaryValue = dec[currentIndex];
    dec[currentIndex] = dec[randomIndex];
    dec[randomIndex] = temporaryValue;
    }

    this.deal = function() {
      var temp = dec.pop();
      return temp;
    }

    this.sortDeck = function() {
      dec.sort();
    }

    this.sizeDeck =function() {
      return dec.length;
    }

    return this.deck
  }


}
