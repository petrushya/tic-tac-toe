
const playerOneName = document.querySelector('.player1 .player');
const playerTwoName = document.querySelector('.player2 .player');
const playerOneNamed = document.querySelector('#playerOneNamed');
const playerTwoNamed = document.querySelector('#playerTwoNamed');
const maxCount = document.querySelector('#gameCounter');
const output = document.querySelector('.gameCounterOutput');
const namedDialog = document.querySelector('#namedDialog');
const confirmNames = document.querySelector('#confirmNames');
const playGame = document.querySelector('.play');
const changeName = document.querySelector('.changeName');
const round = document.querySelector('.round');
const gameInfo = document.querySelector('.gameInfo');
const nextRound = document.querySelector('.nextRound');

changeName.addEventListener("click", () => {
  namedDialog.showModal();
});
confirmNames.addEventListener("click", (event) => {
  event.preventDefault();
  if(playerOneNamed.value) playerOneName.textContent = playerOneNamed.value.toUpperCase();
  if(playerTwoNamed.value) playerTwoName.textContent = playerTwoNamed.value.toUpperCase();
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

const gamePlayers = (function(){
  const players = [
    {name:playerOneName.textContent,mark:'🗙',counter:makeCounter()},
    {name:playerTwoName.textContent,mark:'🞇',counter:makeCounter()}
  ];
  const stepCounter = makeCounter();
  const activePlayer = () => players[stepCounter.getValue() % 2];
  return{
    activePlayer,
    runCounter(){return stepCounter},
    getPlayers(){return players}
  };
})();

const gameCounter = makeCounter();

playGame.addEventListener('click', () => {
  gameInfo.style.display = 'none';
  round.style.visibility = 'visible';
  [gamePlayers.runCounter(), gamePlayers.getPlayers()[0].counter,
  gamePlayers.getPlayers()[1].counter, gameCounter].forEach(item => item.reset());
  gamePlay();
});
nextRound.addEventListener('click', () => {
  gamePlayers.runCounter().reset();
  nextRound.style.visibility = 'hidden';
  gamePlay();
});

function gamePlay(){
  const playerOneScore = document.querySelector('.player1 .score');
  const playerTwoScore = document.querySelector('.player2 .score');
  const message = document.querySelector('.message');
  const boardDiv = document.querySelector('.board');

  const game = playController();
  const activePlayer = () => gamePlayers.activePlayer();
  while(boardDiv.firstChild) boardDiv.removeChild(boardDiv.firstChild);
  const board = game.board;
  board.forEach((row, indexY) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    boardDiv.appendChild(rowDiv);
    row.forEach((cell, indexX) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      cellDiv.dataset.y = indexY;
      cellDiv.dataset.x = indexX;
      rowDiv.appendChild(cellDiv);
    })
  });

  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
  playerOneScore.textContent = gamePlayers.getPlayers()[0].counter.getValue();
  playerTwoScore.textContent = gamePlayers.getPlayers()[1].counter.getValue();
  message.innerHTML = 'First mark<br><span class="mark">&#x1F5D9;</span>';

  boardDiv.addEventListener("click", clickHandlerBoard);
  function clickHandlerBoard(event){
    const indexY = event.target.dataset.y;
    const indexX = event.target.dataset.x;
    if(!indexY || !indexY) return;
    const y = +indexY;
    const x = +indexX;
    game.getMarkBoard(y, x);
    document.querySelector(`[data-y="${y}"][data-x="${x}"]`).textContent = board[y][x].getValue();
    if(game.getWinArr(y, x)[y].length > 0 || gamePlayers.runCounter().getValue() === 9){
      if(gamePlayers.runCounter().getValue() === 9){
        round.textContent = 'Round DROW';
      }else{
        game.getWinArr(y, x).forEach((row, indexY) => {
          if(row.length !== 0){
            row.forEach(cell => boardDiv.querySelector(`[data-y="${indexY}"][data-x="${cell}"]`).classList.add('color'));
          };
        });
        round.textContent = `${activePlayer().name} won the round!`;
      };
      nextRound.style.visibility = 'visible';
      playerOneScore.textContent = gamePlayers.getPlayers()[0].counter.getValue();
      playerTwoScore.textContent = gamePlayers.getPlayers()[1].counter.getValue();
      message.textContent = 'SCORE';
      while(board.length > 0) board.shift();
      boardDiv.removeEventListener("click", clickHandlerBoard);
    }else if(gamePlayers.runCounter().getValue() < 8){
      message.innerHTML = `Next mark<br><span class="mark">${activePlayer().mark}</span>`;
    };
    if(gameCounter.getValue() === +maxCount.value){
      nextRound.style.visibility = 'hidden';
      message.textContent = 'FINAL SCORE';
      setTimeout(() => {
        gameInfo.style.display = 'flex';
        const para = gameInfo.querySelector('p');
        (gamePlayers.getPlayers()[0].counter.getValue() > gamePlayers.getPlayers()[1].counter.getValue()) ?
          para.innerHTML = `GAME OVER,<br>WINNER<br>${playerOneName.textContent}`:
          para.innerHTML = `GAME OVER,<br>WINNER<br>${playerTwoName.textContent}`;
        if(gamePlayers.getPlayers()[0].counter.getValue() === gamePlayers.getPlayers()[1].counter.getValue())
          para.innerHTML = 'GAME OVER<br>IN A DROW';
        while(boardDiv.firstChild) boardDiv.removeChild(boardDiv.firstChild);
      }, 1000);
    };
  }
}

function playController(){
  const board = createBoard().board;
  const getWinArr = (y, x) => findWinArr(y, x, board, gamePlayers.activePlayer()).winArr;
  const getMarkBoard = (y, x) => {
    if(board[y][x].getValue() !== ''){ return };
    board[y][x].setValue(gamePlayers.activePlayer().mark);
    if(getWinArr(y, x)[y].length > 0){
      gamePlayers.activePlayer().counter.increment();
      gameCounter.increment();
    }else if(gamePlayers.runCounter().getValue() < 9){
      gamePlayers.runCounter().increment();
      if(gamePlayers.runCounter().getValue() === 9) gameCounter.increment();
    };
  };
  return{ getMarkBoard, board, getWinArr };
}

function makeCounter(){
  let count = 0;
  function changeBy(value) {count += value};
  return{
    increment () {changeBy(1)},
    reset () {changeBy(-count)},
    getValue () {return count}
  };
};

function findWinArr(y, x, gameBoard, player){
  const winArr = [[],[],[]];
    gameBoard.forEach((row, indexY, arr) => {
      if(arr[indexY+2] && arr[indexY+2][x].getValue()===player.mark &&
      arr[indexY+1][x].getValue()===player.mark && arr[indexY][x].getValue()===player.mark){
        winArr[indexY].push(x); winArr[indexY+1].push(x); winArr[indexY+2].push(x);
      }else{
        row.forEach((cell, index, arr)=>{
          if(arr[index+2] && arr[index+2].getValue()===player.mark &&
          arr[index+1].getValue()===player.mark && arr[index].getValue()===player.mark){
            winArr[y].push(index, index+1, index+2);
          }else if(gameBoard[indexY+2] && gameBoard[indexY+2][index+2] && gameBoard[indexY+2][index+2].getValue()===player.mark &&
          gameBoard[indexY+1][index+1].getValue()===player.mark && cell.getValue()===player.mark){
            winArr[indexY+2].push(index+2); winArr[indexY+1].push(index+1); winArr[indexY].push(index);
          }else if(gameBoard[indexY+2] && gameBoard[indexY+2][index-2] && gameBoard[indexY+2][index-2].getValue()===player.mark &&
          gameBoard[indexY+1][index-1].getValue()===player.mark && cell.getValue()===player.mark){
            winArr[indexY+2].push(index-2); winArr[indexY+1].push(index-1); winArr[indexY].push(index);
          };
        });
      };
    });
  return { winArr };
}

function Cell(){
  let value = '';
  const setValue = (playerMark) => value = playerMark;
  const getValue = () => {return value};
  return { getValue, setValue };
}

function createBoard(){
  const board = [];
  for(let i = 0; i < 3; i++){
    board[i] = [];
    for(let j = 0; j < 3; j++){
      board[i].push(Cell());
    };
  };
  return { board };
}