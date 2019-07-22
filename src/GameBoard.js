import React, {useContext} from 'react';
import './GameBoard.css';
import {GameDispatch} from './App';


export default function GameBoard({board}) {

    return (
        <div className='GameBoard'>
            <div className='GameField'>
                {board['cols'].map((col) => {
                    return <GameColumn key={col['id'].toString()} index={col['id']} cells={col['cells']} />
                })}
            </div>
            <div className='Mask' />
        </div>
    );
}

function GameColumn({index, cells}) {

    const dispatch = useContext(GameDispatch);

    return (
        <div className='GameColumn' onClick={() => dispatch({type: 'placeTile', payload: index})}>{
            cells.map((cell) => {
                const key = cell['id'].toString() + ',' + cell['owner'].toString() + ',' + cell['winner'].toString();
                return <GameCell key={key} winner={cell['winner']} ownedState={cell['owner']} />
            }).reverse()
        }
        </div>
    );
}

function GameCell({ownedState, winner}) {

    let className = 'GameCell';
    if( winner ) {
        className += 'Winner';
    }

    let color = 'white';
    if (ownedState > 0) {
        ownedState === 1 ? color = 'red' : color = 'yellow';
    }

    return (
        <div className={className} style={{color: color}} />
    );

}