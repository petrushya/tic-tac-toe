
const playerOneName = document.querySelector('.player1 .player');
const playerTwoName = document.querySelector('.player2 .player');
const playerOneScore = document.querySelector('.player1 .score');
const playerTwoScore = document.querySelector('.player2 .score');
const message = document.querySelector('.message');
const nextRound = document.querySelector('.nextRound');
const round = document.querySelector('.round');
const gameInfo = document.querySelector('.gameInfo');
const playerOneNamed = document.querySelector('#playerOneNamed');
const playerTwoNamed = document.querySelector('#playerTwoNamed');
const maxCount = document.querySelector('#gameCounter');
const output = document.querySelector('.gameCounterOutput');
const namedDialog = document.querySelector('#namedDialog');
const confirmNames = document.querySelector('#confirmNames');
const playGame = document.querySelector('.play');
const changeName = document.querySelector('.changeName');
const boardDiv = document.querySelector('.board');

const playerOneCounter = makeCounter();
const playerTwoCounter = makeCounter();
const runCounter = makeCounter();
const gameCounter = makeCounter();

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

playGame.addEventListener('click', () => {
  gameInfo.style.display = 'none';
  round.style.visibility = 'visible';
  [runCounter, playerOneCounter, playerTwoCounter, gameCounter].forEach(item => item.reset());
  gamePlay();
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
});
nextRound.addEventListener('click', () => {
  runCounter.reset();
  nextRound.style.visibility = 'hidden';
  gamePlay();
  gameCounter.getValue() + 1 === +maxCount.value ? round.textContent = 'Last Round' :
    round.textContent = `Round ${gameCounter.getValue() + 1} of ${maxCount.value}`;
});

function gamePlay(){
  const game = playController();
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

  playerOneScore.textContent = playerOneCounter.getValue();
  playerTwoScore.textContent = playerTwoCounter.getValue();
  message.innerHTML = 'First mark<br><span class="mark">&#x1F5D9;</span>';
  const activePlayer = () => game.activePlayer();

  function clickHandlerBoard(event){
    const indexY = event.target.dataset.y;
    const indexX = event.target.dataset.x;
    if(!indexY || !indexY) return;
    const y = +indexY;
    const x = +indexX;
    game.getMarkBoard(y, x);
    document.querySelector(`[data-y="${y}"][data-x="${x}"]`).textContent = board[y][x].getValue();
    if(findWinArr(y, x, board, activePlayer()).winCondition > 0){
      playerOneScore.textContent = playerOneCounter.getValue();
      playerTwoScore.textContent = playerTwoCounter.getValue();
      message.textContent = 'SCORE';
      round.textContent = `${activePlayer().name} won the round!`;
      findWinArr(y, x, board, activePlayer()).winArr.forEach((row, indexY) => {
        if(row.length !== 0){
          row.forEach(cell => boardDiv.querySelector(`[data-y="${indexY}"][data-x="${cell}"]`).classList.add('color'));
        };
      });
      nextRound.style.visibility = 'visible';
      while(board.length > 0) board.shift();
      boardDiv.removeEventListener("click", clickHandlerBoard);
    }else if(runCounter.getValue() < 9){
      message.innerHTML = `Next mark<br><span class="mark">${activePlayer().mark}</span>`;
    }else{
      message.textContent = 'SCORE';
      round.textContent = 'Round DROW';
      nextRound.style.visibility = 'visible';
      while(board.length > 0) board.shift();
      boardDiv.removeEventListener("click", clickHandlerBoard);
    };
    if(gameCounter.getValue() === +maxCount.value){
      nextRound.style.visibility = 'hidden';
      message.textContent = 'FINAL SCORE';
      setTimeout(() => {
        gameInfo.style.display = 'flex';
        const para = gameInfo.querySelector('p');
        (playerOneCounter.getValue() > playerTwoCounter.getValue()) ?
          para.innerHTML = `GAME OVER,<br>WINNER<br>${playerOneName.textContent}`:
          para.innerHTML = `GAME OVER,<br>WINNER<br>${playerTwoName.textContent}`;
        if(playerOneCounter.getValue() === playerTwoCounter.getValue())
          para.innerHTML = 'GAME OVER<br>IN A DROW';
        while(boardDiv.firstChild) boardDiv.removeChild(boardDiv.firstChild);
        while(board.length > 0) board.shift();
      }, 1000);
    };
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
}

function playController(){
  const board = createBoard().board;
  const players = [
    {name: playerOneName.textContent, mark: '🗙', counter: playerOneCounter},
    {name: playerTwoName.textContent, mark: '🞇', counter: playerTwoCounter}
  ];
  const activePlayer = () => players[runCounter.getValue()%2];
  const getMarkBoard = (y, x) => {
    if(board[y][x].getValue() !== ''){
      return;
    }else{
      board[y][x].setValue(activePlayer().mark);
      if(findWinArr(y, x, board, activePlayer()).winCondition > 0) {
        activePlayer().counter.increment();
        gameCounter.increment();
      }else{
        runCounter.increment();
        if(runCounter.getValue() === 9) gameCounter.increment();
      };
    };
  };
  return{ getMarkBoard, activePlayer, board, players };
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
  let winCondition = 0;
  const winArr = [[],[],[]];
    gameBoard.forEach((row, indexY, arr) => {
      if(arr[indexY-1] && arr[indexY+1] && arr[indexY-1][x].getValue()===player.mark &&
      row[x].getValue()===player.mark && arr[indexY+1][x].getValue()===player.mark){
        winArr[indexY-1].push(x); winArr[indexY].push(x); winArr[indexY+1].push(x);
      }else{
        row.forEach((cell, index, arr)=>{
          if(arr[index-1] && arr[index+1] && arr[index-1].getValue()===player.mark &&
          cell.getValue()===player.mark && arr[index+1].getValue()===player.mark){
            winArr[y].push(index-1, index, index+1);
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
  if(winArr[y].length > 0) winCondition += 1;
  return { winArr, winCondition };
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
