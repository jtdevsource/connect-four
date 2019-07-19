import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {

  const boardSize = {numRows: 6, numCols: 7};

  return (
    <div className="App">
      <GameBoard boardSize={boardSize}/>
    </div>
  );
}

export default App;
