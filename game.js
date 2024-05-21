
const roundCounter = makeCounter();
const playerOneCounter = makeCounter();
const playerTwoCounter = makeCounter();
const gameCounter = makeCounter();
const playerOne = createPlayer(playerOneName = 'player one', '🗙', playerOneCounter);
const playerTwo = createPlayer(playerTwoName = 'player two', '🞇', playerTwoCounter);
const player1 = document.querySelector('.player1 .player');
const player2 = document.querySelector('.player2 .player');
const scoreOnePlayer = document.querySelector('.player1 .score');
const scoreTwoPlayer = document.querySelector('.player2 .score');
player1.textContent = playerOne.getPlayerName();
player2.textContent = playerTwo.getPlayerName();

const maxCount = document.querySelector('#gameCounter');
const output = document.querySelector(".gameCounter-output");
output.textContent = maxCount.value;
maxCount.addEventListener('input', () => {output.textContent = maxCount.value;});
const nextRound = document.querySelector('.nextRound');
nextRound.addEventListener('click', () => {
  roundCounter.resetCounter();
  gameController();
  nextRound.setAttribute('disabled', '');
  maxCount.setAttribute('disabled', '');
});

const gameBoard = createBoard('.board').getBoard();

function gameController() {
  const message = document.querySelector('.message');
  const boardDiv = document.querySelector('.board');
  const winArr = [];
  const players = [playerOne, playerTwo];
  const activePlayer = () => players[roundCounter.getValue() % 2];

  scoreOnePlayer.textContent = playerOneCounter.getValue();
  scoreTwoPlayer.textContent = playerTwoCounter.getValue();
  message.innerHTML = 'Next mark<br><span class="bigMark">&#x1F5D9;</span>';
  document.querySelectorAll(`.cell`).forEach(cell => {
    cell.textContent = '';
    cell.classList.remove("color");
  });

  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  function clickHandlerBoard(e) {
    while(winArr.firstChild) winArr.removeChild(winArr.firstChild);
    const selectedCell = e.target.dataset.cell;
    if(!selectedCell) return;
    const cell = document.querySelector(`.cell[data-cell="${+selectedCell}"]`);
    if(cell.textContent === ''){
      cell.textContent = activePlayer().getPlayerMark();
      winCombinations.forEach(elem => {
        if(document.querySelector(`.cell[data-cell="${elem[0]}"]`).textContent === activePlayer().getPlayerMark() &&
        document.querySelector(`.cell[data-cell="${elem[1]}"]`).textContent === activePlayer().getPlayerMark() &&
        document.querySelector(`.cell[data-cell="${elem[2]}"]`).textContent === activePlayer().getPlayerMark()){
          winArr.push(elem[0], elem[1], elem[2]);
        };
      });
      if(winArr.length > 0){
        winArr.forEach(cell => document.querySelector(`.cell[data-cell="${cell}"]`).classList.add("color"));
        message.innerHTML = `${activePlayer().getPlayerName()}<br>win round!`;
        gameCounter.increment();
        activePlayer().getPlayerCounter().increment();
        scoreOnePlayer.textContent = playerOneCounter.getValue();
        scoreTwoPlayer.textContent = playerTwoCounter.getValue();
        nextRound.removeAttribute('disabled');
        boardDiv.removeEventListener("click", clickHandlerBoard);
      }else if(roundCounter.getValue() === 8){
        boardDiv.removeEventListener("click", clickHandlerBoard);
        gameCounter.increment();
        message.textContent = 'drow';
        nextRound.removeAttribute('disabled');
      }else{
        roundCounter.increment();
        gameCounter.increment();
        message.innerHTML = `Next mark<br><span class="bigMark">${activePlayer().getPlayerMark()}</span>`;
      };
    }else{ return; };
  };
  boardDiv.addEventListener("click", clickHandlerBoard);
}

function createBoard(divNode) {
  const board = [];
  while(board.length < 9) board.push('');
  const boardDiv = document.querySelector(divNode);
  const getBoard = () => board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add("cell");
    cellDiv.dataset.cell = index;
    boardDiv.appendChild(cellDiv);
  });
  return { getBoard };
}

function makeCounter() {
  let count = 0;
  function changeValue(value) {count += value};
  return{
    increment () {changeValue(1)},
    resetCounter () {changeValue(-count)},
    getValue () {return count}
  };
};

function createPlayer(playerName, playerMark, playerCounter) {
  const player = {name: playerName, mark: playerMark, counter: playerCounter};
  return{
    getPlayerName () {return player.name},
    getPlayerMark () {return player.mark},
    getPlayerCounter () {return player.counter}
  };
};

