import { GameState } from "./reducer";

function gameMessageForGameState(gameState: Pick<GameState, "winner">): string {
  switch (gameState.winner) {
    case 'playerA':
      return 'Player A wins!';
    case 'playerB':
      return 'Player B wins!';
    case 'tie':
      return 'Game is a tie!';
  }
}

export { gameMessageForGameState };
