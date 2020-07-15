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

const GameBoard = () => {
  const [gameState, setGameState] = useState({
    houseCount: 4,
  });

  return (
    <table style={{ border: "3px solid black" }}>
      <tr>
        <td rowSpan={2}>0</td>
        <House
          piecesCount={gameState.houseCount}
          onPlay={() => setGameState({ houseCount: gameState.houseCount + 1 })}
        />
        {/* <House piecesCount={houseCount} /> */}
        <td rowSpan={2}>0</td>
      </tr>
      <tr>
        <House piecesCount={gameState.houseCount} />
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
