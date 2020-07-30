import React, { useReducer } from "react";
import { render } from "react-dom";
import { reducer, generateInitialGameState } from "./reducer";

type HouseProps = {
  piecesCount: number,
  showPlayButton: boolean,
  className?: string,
  onPlay?: Function,
}

const House = ({ piecesCount, onPlay, className, showPlayButton }: HouseProps) => (
  <td className={`${className} house`}>
    <p className="count">{piecesCount}</p>
    <p>{showPlayButton && <button onClick={(_event) => onPlay()}>Play</button>}</p>
  </td>
)

const GameBoard = () => {
  const [gameState, dispatch] = useReducer(reducer, generateInitialGameState());

  return (
    <table>
      <tr>
        <td className="playerB-store" rowSpan={2}>{gameState.playerB.storeCount}</td>
        {gameState.playerB.houses.slice().reverse().map((count, index) => (
          <House
            piecesCount={count}
            showPlayButton={gameState.currentTurn == 'playerB'}
            onPlay={() => dispatch({
              type: 'PLAY_HOUSE',
              houseIndex: gameState.playerB.houses.length - index - 1,
              player: 'playerB',
            })}
            className={`playerB-house${gameState.playerB.houses.length - index}`}
          />
        ))}
        <td className="playerA-store" rowSpan={2}>{gameState.playerA.storeCount}</td>
      </tr>
      <tr>
        {gameState.playerA.houses.map((count, index) => (
          <House
            piecesCount={count}
            showPlayButton={gameState.currentTurn == 'playerA'}
            onPlay={() => dispatch({
              type: 'PLAY_HOUSE',
              houseIndex: index,
              player: 'playerA',
            })}
            className={`playerA-house${index + 1}`}
          />
        ))}
      </tr>
    </table>
  );
};

render(
  <GameBoard />,
  document.getElementById("react-root")
);
