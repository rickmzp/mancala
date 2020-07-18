import React, { useState } from "react";
import { render } from "react-dom";

type HouseProps = {
  piecesCount: number,
  onPlay?: Function,
}

const House = ({ piecesCount, onPlay }: HouseProps) => (
  <td>
    <p>{piecesCount}</p>
    <p><button onClick={(_event) => onPlay()}>Play</button></p>
  </td>
)

interface GameState {
  sideAHouses: Array<number>,
  sideAStoreCount: number,
  sideBHouses: Array<number>,
  sideBStoreCount: number,
}

const generateInitialGameState = (): GameState =>  ({
  sideAHouses: [4, 4, 4, 4, 4, 4],
  sideAStoreCount: 0,
  sideBHouses: [4, 4, 4, 4, 4, 4],
  sideBStoreCount: 0,
});

const GameBoard = () => {
  const [gameState, setGameState] = useState(generateInitialGameState());

  const playHouse = (index: number) => {
    const currentState = gameState;
    const updatedSideAHouses = currentState.sideAHouses;
    const updatedSideBHouses = currentState.sideBHouses;
    let updatedSideAStoreCount = currentState.sideAStoreCount;

    const stonesCurrentlyInHouse = updatedSideAHouses[index]
    updatedSideAHouses[index] = 0;
    for (let i = 1; i <= stonesCurrentlyInHouse; i++) {
      const houseToIncrement = index + i;
      if (houseToIncrement == currentState.sideAHouses.length) {
        updatedSideAStoreCount++;
      } else if (houseToIncrement > currentState.sideAHouses.length) {
        const otherSideHouseToIncrement = houseToIncrement - currentState.sideAHouses.length - 1;
        updatedSideBHouses[otherSideHouseToIncrement] = updatedSideBHouses[otherSideHouseToIncrement] + 1;
      } else {
        updatedSideAHouses[houseToIncrement] = updatedSideAHouses[houseToIncrement] + 1;
      }
    }

    const newState = {
      ...currentState,
      sideAHouses: updatedSideAHouses,
      sideBHouses: updatedSideBHouses,
      sideAStoreCount: updatedSideAStoreCount,
    };
    setGameState(newState);
  }

  return (
    <table style={{ border: "3px solid black" }}>
      <tr>
        <td rowSpan={2}>{gameState.sideBStoreCount}</td>
        {gameState.sideBHouses.slice().reverse().map((count, index) => (
          <House
            piecesCount={count}
            onPlay={() => playHouse(index)}
          />
        ))}
        {/* <House piecesCount={houseCount} /> */}
        <td rowSpan={2}>{gameState.sideAStoreCount}</td>
      </tr>
      <tr>
        {gameState.sideAHouses.map((count, index) => (
          <House
            piecesCount={count}
            onPlay={() => playHouse(index)}
          />
        ))}
        {/* <House />
        <House />
        <House />
        <House />
        <House />
        <House /> */}
      </tr>
    </table>
  );
};

render(
  <GameBoard />,
  document.getElementById("react-root")
);
