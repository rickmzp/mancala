import React, { useState } from "react";
import { render } from "react-dom";

type HouseProps = {
  piecesCount: number,
  className?: string,
  onPlay?: Function,
}

const House = ({ piecesCount, onPlay, className }: HouseProps) => (
  <td className={className}>
    <p className="count">{piecesCount}</p>
    <p><button onClick={(_event) => onPlay()}>Play</button></p>
  </td>
)

interface GameState {
  playerA: {
    houses: Array<number>,
    storeCount: number,
  },
  playerB: {
    houses: Array<number>,
    storeCount: number,
  },
}

const generateInitialGameState = (): GameState =>  ({
  playerA: {
    houses: [4, 4, 4, 4, 4, 4],
    storeCount: 0,
  },
  playerB: {
    houses: [4, 4, 4, 4, 4, 4],
    storeCount: 0,
  },
});

const GameBoard = () => {
  const [gameState, setGameState] = useState(generateInitialGameState());

  const playHouse = (index: number, player: keyof GameState) => {
    const opposingPlayer = player == 'playerA' ? 'playerB' : 'playerA'
    const currentPlayerState = gameState[player];
    const opponentPlayerState = gameState[opposingPlayer];
    const updatedCurrentPlayerHouses = currentPlayerState.houses;
    const updatedOpponentPlayerHouses = opponentPlayerState.houses;
    let currentPlayerStoreCount = currentPlayerState.storeCount;
    let opponentPlayerStoreCount = opponentPlayerState.storeCount;

    const stonesCurrentlyInHouse = updatedCurrentPlayerHouses[index]
    updatedCurrentPlayerHouses[index] = 0;
    for (let i = 1; i <= stonesCurrentlyInHouse; i++) {
      const houseToIncrement = index + i;
      if (houseToIncrement == updatedCurrentPlayerHouses.length) {
        currentPlayerStoreCount++;
      } else if (houseToIncrement > updatedCurrentPlayerHouses.length) {
        const otherSideHouseToIncrement = houseToIncrement - updatedCurrentPlayerHouses.length - 1;
        updatedOpponentPlayerHouses[otherSideHouseToIncrement] = updatedOpponentPlayerHouses[otherSideHouseToIncrement] + 1;
      } else {
        updatedCurrentPlayerHouses[houseToIncrement] = updatedCurrentPlayerHouses[houseToIncrement] + 1;
      }
    }

    const newState = generateInitialGameState();
    newState[player] = {
      houses: updatedCurrentPlayerHouses,
      storeCount: currentPlayerStoreCount,
    }
    newState[opposingPlayer] = {
      houses: updatedOpponentPlayerHouses,
      storeCount: opponentPlayerStoreCount,
    }

    setGameState(newState);
  }

  return (
    <table>
      <tr>
        <td className="playerB-store" rowSpan={2}>{gameState.playerB.storeCount}</td>
        {gameState.playerB.houses.slice().reverse().map((count, index) => (
          <House
            piecesCount={count}
            onPlay={() => playHouse(gameState.playerB.houses.length - index - 1, 'playerB')}
            className={`playerB-house${gameState.playerB.houses.length - index}`}
          />
        ))}
        <td className="playerA-store" rowSpan={2}>{gameState.playerA.storeCount}</td>
      </tr>
      <tr>
        {gameState.playerA.houses.map((count, index) => (
          <House
            piecesCount={count}
            onPlay={() => playHouse(index, 'playerA')}
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
