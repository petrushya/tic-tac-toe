
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

function gameController(playerOneName = 'player one', playerTwoName = 'player two') {

  const getBoard = gameBoard.getBoard();
  console.log(getBoard);

  const players = [
    { name: playerOneName, mark: '🗙' },
    { name: playerTwoName, mark: '🞇' }
  ];

  const activePlayer = () => players[roundCounter.getValue() % 2];

  console.log(`Next mark ${activePlayer().mark}`);

  const playRound = (cell) => {
    if(getBoard[cell].getMark() !== '') return;
    if(getBoard[cell].getMark() === ''){
      getBoard[cell].addMark(activePlayer().mark);

      roundCounter.increment();
      console.log(`Next mark ${activePlayer().mark}`);
      console.log(getBoard);
    };

  };

  return { playRound, getBoard };
}