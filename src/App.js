import React, { useReducer } from 'react';
import './App.css';
import GameBoard from './GameBoard';

export const GameDispatch = React.createContext(null);

function App() {

  const [gameState, gameDispatch] = useReducer(gameReducer, { turn: 1, gameOver: false, board: createBoard() });

  let labelText = gameState.turn === 1 ? `Red's Turn` : `Yellow's Turn`;

  if (gameState.gameOver) {
    labelText = gameState.turn === 0 ? 'Draw!' : gameState.turn === 1 ? 'Red Wins!' : 'Yellow Wins!';
  }

  return (
    <div className="App">
      <GameDispatch.Provider value={gameDispatch}>
        <label>{labelText}</label>
        <GameBoard board={gameState.board} />
        <button type="reset" onClick={() => gameDispatch({ type: 'newGame' })}>New Game</button>
      </GameDispatch.Provider>
    </div>
  );
}

function gameReducer(state, action) {

  if (action.type === 'newGame') {
    return { board: createBoard(), turn: 1, gameOver: false };
  }

  if (action.type === 'placeTile') {
    const thisTurn = state.turn;
    let board = state.board;

    const incoming = action.payload;
    const thisCount = board.cols[incoming].count;
    const valid = !state.gameOver && thisCount < board.numRows;

    if (!valid) {
      return state;
    }

    board.cols[incoming].cells[thisCount].owner = thisTurn;
    board.cols[incoming].count = thisCount + 1;

    const winner = evaluateBoard(board, incoming);

    if (winner) {
      return { board: board, turn: thisTurn, gameOver: true };
    }

    const allFull = board.cols.filter((col) => col.count >= board.numRows).length === board.numCols;
    if (allFull) {
      return { board: board, turn: 0, gameOver: true };
    }

    return { board: board, turn: (thisTurn % 2) + 1 };
  }

  throw new Error("Something went horribly wrong.");
}

function evaluateBoard(board, lastCol) {

  const lastRow = board.cols[lastCol].count - 1;
  const searchDirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const depth = 4;
  const start = [[lastCol, lastRow]];

  // this finds all points around the last drop to check for wins, saves checking the board every time
  searchDirs.forEach((dir) => {
    for (var i = 0; i < depth; ++i) {
      const thisPath = [(dir[0] * i) + start[0][0], (dir[1] * i) + start[0][1]];
      if ((thisPath[0] >= 0 && thisPath[0] < board.numCols) && (thisPath[1] >= 0 && thisPath[1] < board.numRows)) {
        start.push(thisPath);
      }
    }
  });

  const thisOwner = board.cols[lastCol].cells[lastRow].owner;
  let result = false;

  // this iterates through all the points to find all wins
  start.forEach((pos) => {
    searchDirs.forEach((dir) => {
      let tail = 3;
      let path = [board['cols'][pos[0]]['cells'][pos[1]]];
      for (var i = 1; i <= tail; ++i) {
        const thisPath = [(dir[0] * i) + pos[0], (dir[1] * i) + pos[1]];
        if ((thisPath[0] >= 0 && thisPath[0] < board.numCols) && (thisPath[1] >= 0 && thisPath[1] < board.numRows)) {
          path.push(board['cols'][thisPath[0]]['cells'][thisPath[1]]);
        }
      }

      if (path.filter(cell => cell.owner === thisOwner).length >= 4) {
        path.map(cell => cell.winner = true);
        result = true;
      }
    });
  });

  return result;
}

function createBoard() {
  const boardSize = { numRows: 6, numCols: 7 };

  return {
    numRows: boardSize.numRows,
    numCols: boardSize.numCols,
    cols: Array.from({ length: boardSize.numCols }, (_, i) => {
      return {
        id: i,
        count: 0,
        cells:
          Array.from({ length: boardSize.numRows }, (_, i) => { return { id: i, winner: false, owner: 0 } })
      };
    })
  }
}

export default App;
