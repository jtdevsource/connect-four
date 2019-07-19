import React from 'react';
import './GameBoard.css';

export default function GameBoard(props) {

    const boardSize = props.boardSize;

    const createBoard = () => {
        return Array.from({ length: boardSize.numCols }, (_, i) => {
            return {
                id: i,
                cells:
                    Array.from({ length: boardSize.numRows }, (_, i) => { return { id: i, owner: 0 } })
            };
        });
    }

    const board = props.board || createBoard();

    return (
        <div className='GameBoard'>
            <div className='GameField'>
                {board.map((col, colIndex) => {
                    return <GameColumn index={colIndex} cells={col.cells} />
                })}
            </div>
            <div className='Mask' />
        </div>
    );
}

function GameColumn(props) {

    const key = props.index;
    const cells = props.cells;

    return (
        <div className='GameColumn' key={key}>{
            cells.map((cell, cellIndex) => {
                return <GameCell colIndex={key} rowIndex={cellIndex} ownedState={cell.owner} />
            }).reverse()
        }</div>
    );
}

function GameCell(props) {

    const rowIndex = props.rowIndex;
    const colIndex = props.colIndex;

    const ownedState = (rowIndex+colIndex) % 3; 
    // const ownedState = props.ownedState;

    let className = 'GameCell';
    if (ownedState > 0) {
        ownedState === 1 ? className += ' Red' : className += ' Yellow';
    }

    return (
        <div className={className} key={rowIndex}/>
    );

}