import * as React from "react";
import * as ReactDOM from "react-dom";

const House = () => (
  <td>
    <p>4</p>
    <p><button>Play</button></p>
  </td>
)

const GameBoard = () => (
  <table style={{border: "3px solid black"}}>
    <tr>
      <td rowSpan={2}>0</td>
      <House />
      <House />
      <House />
      <House />
      <House />
      <House />
      <td rowSpan={2}>0</td>
    </tr>
    <tr>
      <House />
      <House />
      <House />
      <House />
      <House />
      <House />
    </tr>
  </table>
);

ReactDOM.render(
  <GameBoard />,
  document.getElementById("react-root")
);
