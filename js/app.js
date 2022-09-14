// Classes //
class Deck{
  constructor( numDecks, cardValArr, cardStyleArr){
    this.deckArr = []
    for(let i = 0; i < numDecks; i++){
      for(let val of cardValArr){
        for (let style of cardStyleArr){
          this.deckArr.push(`${style}${val}`)
        }
      }
    }
  }

  shuffle(repeat){
    let newDeck = []
    for(let i = 0; i < repeat; i++){
      newDeck = []
      while (this.deckArr.length > 0){
        let ranIdx = Math.floor(Math.random() * parseInt(this.deckArr.length))
        newDeck.push(this.deckArr.splice(ranIdx,1)[0])
      }
      this.deckArr =  newDeck
    }
  }

  deal(){
    return this.deckArr.shift()
  }
}

class Player{
  constructor(nickname){
    this.nickname = nickname
    this.hand = []
    this.tokens = 100
    this.bet = 0
  }

  placeBet(amt){
    this.tokens -= amt
    this.bet += amt
  }

  handValue(){
    let aceCount = 0
    let handVal = 0
    for(let card of this.hand){
      if(card[1] === 'A'){
        aceCount += 1
      } else if (['K','Q','J','1'].includes(card[1])){
        handVal += 10
      } else {
        handVal += parseInt(card[2])
      }
    } 
    for (let i = 0; i < aceCount; i++){
      handVal += handVal < 11 ? 11 : 1
    }
    return handVal
  }
}

class Game{
  constructor(numPlayers,gameMode){
    this.turn = 0
    this.playersArr = [new Player('Dealer')]
    for(let i = 0; i < numPlayers; i++){
      this.playersArr.push(new Player(`Player${i+1}`))
    }
    this.deck = gameMode = 'standard' ? new Deck(1,bjCardValArr,bjCardStyleArr) : '?'
    this.deck.shuffle(10)
  }

  dealStart(){
    for(let i = 0; i < 2; i++){
      for(let player of this.playersArr){
        player.hand.push(this.deck.deal())
      }
    }
    this.turn = 1
  }

  dealPlayer(){
    this.playersArr[this.turn].hand.push(this.deck.deal())
  }

  logGame(){
    console.log(this.turn)
    console.log(this.playersArr)
    console.log(this.deck)
  }
}

// Constants //
const bjCardValArr = ['A','02','03','04','05','06','07','08','09','10','J','Q','K']
const bjCardStyleArr = ['d','h','s','c']
const numDecks = 1

// Variables (State) //
let game = new Game(3,'standard')

// Cached Element References // 
const gameSpace = document.querySelector(`#game-space`)
console.log(gameSpace)

// Event Listeners //


// Functions //

game.dealStart()
game.logGame()
game.playersArr[1].handValue()
game.dealPlayer()
game.playersArr[1].handValue()
game.logGame()

function render(){
  gameSpace.innerHTML = ''
  for (let player of game.playersArr){
    newPlayerDiv = document.createElement('div')
    newPlayerDiv.setAttribute("class", "player-div")
    newPlayerDiv.setAttribute("id", `${player.nickname}`)

    playerNameEl = document.createElement('h1')
    playerNameEl.textContent = `${player.nickname}`
    newPlayerDiv.appendChild(playerNameEl)

    for (let card of player.hand){
      newCardDiv= document.createElement('div')
      newCardDiv.setAttribute("class", `card ${card}`)
      newPlayerDiv.appendChild(newCardDiv)
    }
    handValEl = document.createElement('h1')
    handValEl.textContent = `${player.handValue()}`
    newPlayerDiv.appendChild(handValEl)

    gameSpace.appendChild(newPlayerDiv)
  }
}

render()