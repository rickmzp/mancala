import { gameMessageForGameState } from '../../../src/gameMessage';

describe('gameMessageForGameState', () => {
  it('generates a message for when player A wins', () => {
    expect(
      gameMessageForGameState({ winner: 'playerA' })
    ).to.equal('Player A wins!');
  });

  it('generates a message for when player B wins', () => {
    expect(
      gameMessageForGameState({ winner: 'playerB' })
    ).to.equal('Player B wins!');
  });

  it('generates a message for when there is a tie', () => {
    expect(
      gameMessageForGameState({ winner: 'tie' })
    ).to.equal('Game is a tie!');
  });
});
