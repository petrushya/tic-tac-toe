
const board = document.querySelector('.board');
const player1 = document.querySelector('.player1 .player');
const player2 = document.querySelector('.player2 .player');

const gameBoard = (function() {
  const board = [];
  while(board.length < 9) board.push(Cell());
  const getBoard = () => board;
  const newBoard = () => getBoard().forEach(cell => cell.addMark(''));
  return { getBoard, newBoard };
})();

function Cell() {
  let value = '';
  const addMark = (player) => {value = player;};
  const getMark = () => value;
  return { addMark, getMark };
}

const makeCounter = function() {
  let count = 0;
  function changeValue(value) {count += value};
  return{
    increment () {changeValue(1)},
    resetCounter () {changeValue(-count)},
    getValue () {return count}
  };
};

const roundCounter = makeCounter();

const players = [
  { name: 'player one', mark: '🗙' },
  { name: 'player two', mark: '🞇' }
];

player1.textContent = players[0].name;
player2.textContent = players[1].name;

function gameController(playerOneName, playerTwoName) {

  const getBoard = gameBoard.getBoard();
  console.log(getBoard.map(cell => cell.getMark()));

  const activePlayer = () => players[roundCounter.getValue() % 2];

  console.log(`Next mark ${activePlayer().mark}`);

  const playRound = (cell) => {
    if(getBoard[cell].getMark() !== '') return;
    if(getBoard[cell].getMark() === ''){
      getBoard[cell].addMark(activePlayer().mark);

      roundCounter.increment();
      console.log(`Next mark ${activePlayer().mark}`);
      console.log(getBoard.map(cell => cell.getMark()));
    };

  };

  return { playRound, getBoard };
}

function screenController() {
  const game = gameController();
  const boardDiv = document.querySelector('.board');
  boardDiv.style.backgroundColor = '#000';
  const board = game.getBoard;

  while(boardDiv.firstChild) boardDiv.removeChild(boardDiv.firstChild);

  board.forEach((cell, index) => {
    const cellButton = document.createElement("div");
    cellButton.classList.add("cell");
    cellButton.dataset.cell = index;
    boardDiv.appendChild(cellButton);
  });

  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.cell;
    if(!selectedCell) return;
    game.playRound(+selectedCell);
    document.querySelector(`.cell[data-cell="${+selectedCell}"]`).textContent = board[+selectedCell].getMark();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

}

screenController();