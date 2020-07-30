import React, { useReducer } from "react";
import { render } from "react-dom";
import { reducer, generateInitialGameState, GameState } from "./reducer";
import { gameMessageForGameState } from "./gameMessage";

type HouseProps = {
  piecesCount: number,
  showPlayButton: boolean,
  className?: string,
  onPlay?: Function,
}

const House = ({ piecesCount, onPlay, className, showPlayButton }: HouseProps) => (
  <td className={`${className} house`}>
    <p className="count">{piecesCount}</p>
    <p>{showPlayButton && <button data-test-id='playButton' onClick={(_event) => onPlay()}>Play</button>}</p>
  </td>
)

type GameBoardProps = {
  gameState: GameState,
  dispatch: Function,
}

const GameBoard = ({ gameState, dispatch }: GameBoardProps) => {
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
            className={`playerB-house playerB-house${gameState.playerB.houses.length - index}`}
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
            className={`playerA-house playerA-house${index + 1}`}
          />
        ))}
      </tr>
    </table>
  );
};

const App = () => {
  const [gameState, dispatch] = useReducer(reducer, generateInitialGameState());

  return <>
    <GameBoard gameState={gameState} dispatch={dispatch} />
    <p id="game-message">{gameMessageForGameState(gameState)}</p>
    <div>
      <h3>Game state overrides</h3>
      <button
        onClick={
          () => dispatch({
            type: 'OVERRIDE_GAME_STATE',
            newState: {
              currentTurn: 'playerB',
              playerB: {
                houses: [0, 0, 0, 0, 0, 1],
                storeCount: 24,
              },
              playerA: {
                houses: [0, 0, 0, 0, 0, 1],
                storeCount: 22,
              },
              winner: null
            }
          })
        }>
        Set game state to Player B about to win
      </button>
    </div>
  </>;
}

render(
  <App />,
  document.getElementById("react-root")
);
