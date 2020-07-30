// TODO: can we move this file out of the integration folder?
import reducer, { generateInitialGameState } from '../../../src/reducer';

it('handles large numbers of stones in a house', () => {
  const initialState = generateInitialGameState();
  initialState.playerB.houses = [0, 0, 0, 0, 0, 0];
  initialState.playerA.houses = [0, 0, 0, 0, 0, 24];

  const newState = reducer(initialState, {
    type: 'PLAY_HOUSE',
    player: 'playerA',
    houseIndex: 5
  });

  expect(newState.playerB.houses).to.deep.equal([2, 2, 2, 2, 2, 2]);
  expect(newState.playerA.houses).to.deep.equal([2, 2, 2, 2, 1, 1]);
  expect(newState.playerA.storeCount).to.equal(2);
  expect(newState.playerB.storeCount).to.equal(0);
});

describe('end of game scenarios', () => {
  it('allows player A to win the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerA',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 24, playerBStoreCount: 22,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('playerA');
  });

  it('allows player A to lose the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerA',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 22, playerBStoreCount: 24,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('playerB');
  });

  it('allows player A to tie the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerA',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 23, playerBStoreCount: 23,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('tie');
  });

  it('allows player B to win the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerB',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 22, playerBStoreCount: 24,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('playerB');
  });

  it('allows player B to lose the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerB',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 24, playerBStoreCount: 22,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('playerA');
  });

  it('allows player B to tie the game', () => {
    const finalState = playLastMoveForPlayer(
      'playerB',
      generateAlmostAtEndOfGameState({
        playerAStoreCount: 23, playerBStoreCount: 23,
      })
    );

    expect(finalState.currentTurn).to.equal(null);
    expect(finalState.winner).to.equal('tie');
  });

  function generateAlmostAtEndOfGameState(
    { playerAStoreCount, playerBStoreCount }
  ) {
    const state = generateInitialGameState();

    state.playerB.houses = [0, 0, 0, 0, 0, 1];
    state.playerB.storeCount = playerBStoreCount;

    state.playerA.houses = [0, 0, 0, 0, 0, 1];
    state.playerA.storeCount = playerAStoreCount;

    return state;
  }

  function playLastMoveForPlayer(player, initialState) {
    return reducer(initialState, {
      type: 'PLAY_HOUSE',
      player,
      houseIndex: 5
    })
  }
})
