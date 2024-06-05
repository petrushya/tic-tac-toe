const playerOne = document.querySelector('.player1 .player');
const playerTwo = document.querySelector('.player2 .player');
const playerOneNamed = document.querySelector('#playerOneNamed');
const playerTwoNamed = document.querySelector('#playerTwoNamed');
const playerOneScore = document.querySelector('.player1 .score');
const playerTwoScore = document.querySelector('.player2 .score');
const maxCount = document.querySelector('#gameCounter');
const output = document.querySelector('.gameCounterOutput');
const round = document.querySelector('.round');
const nextRound = document.querySelector('.nextRound');
const gameInfo = document.querySelector('.gameInfo');
const namedDialog = document.querySelector('#namedDialog');
const confirmNames = document.querySelector('#confirmNames');
const playGame = document.querySelector('.play');
const changeName = document.querySelector('.changeName');

const playerOneCounter = makeCounter();
const playerTwoCounter = makeCounter();
const runCounter = makeCounter();
const gameCounter = makeCounter();
let namedPlayers = getPlayers(playerOne.textContent, playerTwo.textContent).getPlayers();
changeName.addEventListener("click", () => {
  namedDialog.showModal();
});
confirmNames.addEventListener("click", (event) => {
  event.preventDefault();
  if(playerOneNamed.value) playerOne.textContent = playerOneNamed.value.toUpperCase();
  if(playerTwoNamed.value) playerTwo.textContent = playerTwoNamed.value.toUpperCase();
  namedPlayers = getPlayers(playerOne.textContent, playerTwo.textContent).getPlayers();
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
  [runCounter, playerOneCounter, playerTwoCounter, gameCounter].forEach(element => element.resetCounter());
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
  gamePlayer();
});
nextRound.addEventListener('click', () => {
  runCounter.resetCounter();
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
  nextRound.style.visibility = 'hidden';
  gamePlayer();
});

const activePlayer = () => namedPlayers[runCounter.getValue()%2];
const boardDiv = document.querySelector('.board');

function gamePlayer(){

  while(boardDiv.firstChild) boardDiv.removeChild(boardDiv.firstChild);
  const gameBoard = createBoard(9).getBoard();
  gameBoard.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.dataset.cell = index;
    boardDiv.appendChild(cellDiv);
  });

  playerOneScore.textContent = playerOneCounter.getValue();
  playerTwoScore.textContent = playerTwoCounter.getValue();
  const message = document.querySelector('.message');
  message.innerHTML = 'First mark<br><span class="mark">&#x1F5D9;</span>';

  function clickHandlerBoard(event){
    const selectedCell = event.target.dataset.cell;
    if(!selectedCell) return;
    const cell = boardDiv.querySelector(`.cell[data-cell="${+selectedCell}"]`);
    if(cell.textContent !== '') return;
    cell.textContent = activePlayer().mark;
    const roundWinArr = winController(boardDiv).getWinArr();
    if(roundWinArr.length > 0){
      roundWinArr.forEach(cell => boardDiv.querySelector(`.cell[data-cell="${cell}"]`).classList.add("color"));
      winController(boardDiv).resetWinController();
      activePlayer().counter.increment();
      playerOneScore.textContent = playerOneCounter.getValue();
      playerTwoScore.textContent = playerTwoCounter.getValue();
      gameCounter.increment();
      round.textContent = `${activePlayer().name} won the round!`;
      message.textContent = `SCORE`;
      nextRound.style.visibility = 'visible';
      boardDiv.removeEventListener("click", clickHandlerBoard);
    }else if(runCounter.getValue() === 8){
      gameCounter.increment();
      message.textContent = 'SCORE';
      nextRound.style.visibility = 'visible';
      round.textContent = `Round Drow`;
      boardDiv.removeEventListener("click", clickHandlerBoard);
    }else{
      runCounter.increment();
      message.innerHTML = `Next mark<br><span class="mark">${activePlayer().mark}</span>`;
    };
    if(gameCounter.getValue() === +maxCount.value){
      setTimeout(() => {
        gameInfo.style.display = 'flex';
        const para = gameInfo.querySelector('p');
        (playerOneCounter.getValue() > playerTwoCounter.getValue()) ?
          para.innerHTML = `GAME OVER,<br>WINNER<br>${namedPlayers[0].name}`:
          para.innerHTML = `GAME OVER,<br>WINNER<br>${namedPlayers[1].name}`;
        if(playerOneCounter.getValue() === playerTwoCounter.getValue())
          para.innerHTML = 'GAME OVER<br>IN A DROW';
      }, 1000);
      roundWinArr.length > 0 ? round.textContent = `${activePlayer().name} won the round!`:
        round.textContent = `Round Drow`;
      message.textContent = 'FINAL SCORE';
      nextRound.style.visibility = 'hidden';
    };
  };
  boardDiv.addEventListener("click", clickHandlerBoard);
}

function winController(div){
  let winArr = [];
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  winCombinations.forEach(item => {
    if(div.childNodes[item[0]].textContent === activePlayer().mark &&
    div.childNodes[item[1]].textContent === activePlayer().mark &&
    div.childNodes[item[2]].textContent === activePlayer().mark){
      winArr.push(item[0], item[1], item[2]);
    };
  });
  function resetWinController(){
    while(winArr.firstChild) winArr.removeChild(winArr.firstChild);
  };
  return{ getWinArr(){return winArr}, resetWinController };
}

function createBoard(index){
  const board = [];
  while(board.length < index) board.push('');
  return { getBoard(){return board} };
}

function makeCounter(){
  let count = 0;
  function changeBy(value){count += value};
  return{
    increment(){changeBy(1)},
    resetCounter(){changeBy(-count)},
    getValue(){return count}
  };
}

function getPlayers(playerOneName, playerTwoName){
  const players = [
    {name: playerOneName, mark: '🗙', counter: playerOneCounter},
    {name: playerTwoName, mark: '🞆', counter: playerTwoCounter}
  ];
  return { getPlayers(){return players} };
}
