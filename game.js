const playerOne = document.querySelector('.player1 .player');
const playerTwo = document.querySelector('.player2 .player');
const playerOneNamed = document.querySelector('#playerOneNamed');
const playerTwoNamed = document.querySelector('#playerTwoNamed');
const scoreOnePlayer = document.querySelector('.player1 .score');
const scoreTwoPlayer = document.querySelector('.player2 .score');
const maxCount = document.querySelector('#gameCounter');
const output = document.querySelector('.gameCounterOutput');
const round = document.querySelector('.round');
const nextRound = document.querySelector('.nextRound');
const gameInfo = document.querySelector('.gameInfo');
const changeName = document.querySelector('.changeName');
const namedDialog = document.querySelector('#namedDialog');
const confirmNames = document.querySelector('#confirmNames');
const playGame = document.querySelector('.play');
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

const roundCounter = makeCounter();
const playerOneCounter = makeCounter();
const playerTwoCounter = makeCounter();
const gameCounter = makeCounter();
let players = getPlayers(playerOne.textContent, playerTwo.textContent).players;

changeName.addEventListener("click", () => {
  namedDialog.showModal();
});
confirmNames.addEventListener("click", (e) => {
  e.preventDefault();
  if(playerOneNamed.value) playerOne.textContent = playerOneNamed.value.toUpperCase();
  if(playerTwoNamed.value) playerTwo.textContent = playerTwoNamed.value.toUpperCase();
  players = getPlayers(playerOne.textContent, playerTwo.textContent).players;
  playerOneNamed.value = "";
  playerTwoNamed.value = "";
  namedDialog.close();
  playGame.focus();
});
namedDialog.addEventListener("close", () => {
  playerOneNamed.value = "";
  playerTwoNamed.value = "";
  changeName.blur();
});

output.textContent = maxCount.value;
maxCount.addEventListener('input', () => {output.textContent = maxCount.value;});

playGame.addEventListener('click', () => {
  gameInfo.style.display = 'none';
  round.style.visibility = 'visible';
  [roundCounter, playerOneCounter, playerTwoCounter, gameCounter].forEach(element => element.resetCounter());
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
  gameController();
});
nextRound.addEventListener('click', () => {
  roundCounter.resetCounter();
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
  nextRound.style.visibility = 'hidden';
  gameController();
});

createBoard('.board').getBoard();

function gameController() {
  const message = document.querySelector('.message');
  const boardDiv = document.querySelector('.board');
  const winArr = [];

  const activePlayer = () => players[roundCounter.getValue() % 2];

  scoreOnePlayer.textContent = playerOneCounter.getValue();
  scoreTwoPlayer.textContent = playerTwoCounter.getValue();
  message.innerHTML = 'Next mark<br><span class="mark">&#x1F5D9;</span>';
  document.querySelectorAll(`.cell`).forEach(cell => {
    cell.textContent = '';
    cell.classList.remove("color");
  });

  function clickHandlerBoard(event){
    while(winArr.firstChild) winArr.removeChild(winArr.firstChild);
    const selectedCell = event.target.dataset.cell;
    if(!selectedCell) return;
    const cell = document.querySelector(`.cell[data-cell="${+selectedCell}"]`);
    if(cell.textContent === ''){
      cell.textContent = activePlayer().mark;
      winCombinations.forEach(elem => {
        if(document.querySelector(`.cell[data-cell="${elem[0]}"]`).textContent === activePlayer().mark &&
        document.querySelector(`.cell[data-cell="${elem[1]}"]`).textContent === activePlayer().mark &&
        document.querySelector(`.cell[data-cell="${elem[2]}"]`).textContent === activePlayer().mark){
          winArr.push(elem[0], elem[1], elem[2]);
        };
      });
      if(winArr.length > 0){
        winArr.forEach(cell => document.querySelector(`.cell[data-cell="${cell}"]`).classList.add("color"));
        message.textContent = `SCORE`;
        gameCounter.increment();
        activePlayer().counter.increment();
        scoreOnePlayer.textContent = playerOneCounter.getValue();
        scoreTwoPlayer.textContent = playerTwoCounter.getValue();
        round.textContent = `${activePlayer().name} won the round!`;
        nextRound.style.visibility = 'visible';
        boardDiv.removeEventListener("click", clickHandlerBoard);
      }else if(roundCounter.getValue() === 8){
        boardDiv.removeEventListener("click", clickHandlerBoard);
        gameCounter.increment();
        message.textContent = 'SCORE';
        nextRound.style.visibility = 'visible';
        round.textContent = `Round Drow`;
      }else{
        roundCounter.increment();
        message.innerHTML = `Next mark<br><span class="mark">${activePlayer().mark}</span>`;
      };
      if(gameCounter.getValue() === +maxCount.value){
        gameInfo.style.display = 'flex';
        const para = gameInfo.querySelector('p');
        (playerOneCounter.getValue() > playerTwoCounter.getValue()) ?
          para.innerHTML = `GAME OVER,<br>WINNER<br>${players[0].name}`:
          para.innerHTML = `GAME OVER,<br>WINNER<br>${players[1].name}`;
        if(playerOneCounter.getValue() === playerTwoCounter.getValue())
          para.innerHTML = 'GAME OVER<br>IN A DROW';
        winArr.length > 0 ? round.textContent = `${activePlayer().name} won the round!`:
          round.textContent = `Round Drow`;
        message.textContent = 'FINAL SCORE';
        nextRound.style.visibility = 'hidden';
      };
    };
  };
  boardDiv.addEventListener("click", clickHandlerBoard);
};

function createBoard(divNode){
  const board = [];
  while(board.length < 9) board.push('');
  const boardDiv = document.querySelector(divNode);
  const getBoard = () => board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.dataset.cell = index;
    boardDiv.appendChild(cellDiv);
  });
  return { getBoard };
};

function makeCounter(){
  let count = 0;
  function changeBy(value) {count += value};
  return{
    increment () {changeBy(1)},
    resetCounter () {changeBy(-count)},
    getValue () {return count}
  };
};

function getPlayers(playerOneName, playerTwoName){
  const players = [
    {name: playerOneName, mark: '🗙', counter: playerOneCounter},
    {name: playerTwoName, mark: '🞇', counter: playerTwoCounter}
  ];
  return { players };
};