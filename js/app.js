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
    if (amt < this.tokens){
      this.tokens -= amt
      this.bet += amt
      return true
    }
    return false
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
    if (handVal > 21){
      handVal = 'BUST'
    }
    return handVal
  }
}

class Game{
  constructor(numPlayers,gameMode){
    this.turn = 0
    this.playersArr = [new Player('Dealer')]
    for(let i = 0; i < numPlayers; i++){
      this.playersArr.push(new Player(`Player ${i+1}`))
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
    if (this.playersArr[this.turn].handValue() === 'BUST'){
      this.nextPlayer()
    }
  }

  nextPlayer(){
    this.turn += this.turn < (this.playersArr.length-1) ? 1 : (-(this.playersArr.length-1))
    if (this.turn === 0){
      this.dealerExecute()
    }
  }

  dealerExecute(){
    console.log(this.playersArr)
    while (this.playersArr[this.turn].handValue() < 17 && this.playersArr[0].handValue() !== 'BUST'){
      this.dealPlayer()
    }
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
const btnHit = document.querySelector(`#hit-btn`)
const btnStand = document.querySelector(`#stand-btn`)
const btnDD = document.querySelector(`#dd-btn`)



// Event Listeners //
btnHit.addEventListener(`click`, hit)
btnStand.addEventListener(`click`, stand)
btnDD.addEventListener(`click`, double)


// Functions //

game.dealStart()
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
      newCardDiv.setAttribute("class", `card large ${card}`)
      newPlayerDiv.appendChild(newCardDiv)
    }

    playerInfoDiv = document.createElement('div')
    playerInfoDiv.setAttribute("class","player-info")

    handValEl = document.createElement('h2')
    handValEl.textContent = `Total: ${player.handValue()}`
    playerInfoDiv.appendChild(handValEl)

    playerTokensEl = document.createElement('h2')
    playerTokensEl.textContent = `Tokens:${player.tokens}`
    playerInfoDiv.appendChild(playerTokensEl)

    playerBetEl = document.createElement('h2')
    playerBetEl.textContent = `Bet:${player.bet}`
    playerInfoDiv.appendChild(playerBetEl)

    newPlayerDiv.appendChild(playerInfoDiv)

    gameSpace.appendChild(newPlayerDiv)
  }
  playerNodeList = document.querySelectorAll(`.player-div`)
  playerNodeList[game.turn].style.color = 'yellow'
}

render()

function hit(){
  game.dealPlayer()
  render()
}

function stand(){
  game.nextPlayer()
  render()
}

function double(){
  game.dealPlayer()
}