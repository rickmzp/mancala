// TODO: can we move this file out of the integration folder?
import reducer, { generateInitialGameState, GameState, InvalidNumberOfGamePiecesError } from '../../../src/reducer';

it("distributes the stones when passing the opposite player's store", () => {
  const initialState = generateInitialGameState();
  initialState.playerB.storeCount = 3;
  initialState.playerB.houses = [3, 2, 1, 9, 8, 0];
  initialState.playerA.storeCount = 4;
  initialState.playerA.houses = [3, 2, 2, 1, 1, 9];

  const newState = reducer(initialState, {
    type: 'PLAY_HOUSE',
    player: 'playerA',
    houseIndex: 5
  });

  expect(newState.playerB.houses).to.deep.equal([4, 3, 2, 10, 9, 1]);
  expect(newState.playerA.houses).to.deep.equal([4, 3, 2, 1, 1, 0]);
  expect(newState.playerA.storeCount).to.equal(5);
  expect(newState.playerB.storeCount).to.equal(3);
});

it('handles large numbers of stones in a house', () => {
  const initialState = generateInitialGameState();
  initialState.playerB.storeCount = 24;
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
  expect(newState.playerB.storeCount).to.equal(24);
});

it("allows capturing of opposing player's stones", () => {
  const initialState = generateInitialGameState();
  initialState.playerB.storeCount = 46;
  initialState.playerB.houses = [1, 0, 0, 0, 0, 0];
  initialState.playerA.houses = [0, 0, 0, 0, 1, 0];

  const newState = reducer(initialState, {
    type: 'PLAY_HOUSE',
    player: 'playerA',
    houseIndex: 4
  });

  expect(newState.playerB.houses).to.deep.equal([0, 0, 0, 0, 0, 0]);
  expect(newState.playerA.houses).to.deep.equal([0, 0, 0, 0, 0, 0]);
  expect(newState.playerA.storeCount).to.equal(2);
  expect(newState.playerB.storeCount).to.equal(46);
})

it("allows capturing of opposing player's stones after going around the board", () => {
  const initialState = generateInitialGameState();
  initialState.playerB.storeCount = 38;
  initialState.playerB.houses = [0, 0, 0, 0, 0, 1];
  initialState.playerA.houses = [0, 0, 0, 1, 0, 8];

  const newState = reducer(initialState, {
    type: 'PLAY_HOUSE',
    player: 'playerA',
    houseIndex: 5
  });

  expect(newState.playerB.houses).to.deep.equal([1, 1, 1, 1, 1, 0]);
  expect(newState.playerA.houses).to.deep.equal([0, 0, 0, 1, 0, 0]);
  expect(newState.playerA.storeCount).to.equal(4);
  expect(newState.playerB.storeCount).to.equal(38);
})

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

  interface EndOfGameStoreCounts {
    playerAStoreCount: number,
    playerBStoreCount: number,
  }

  function generateAlmostAtEndOfGameState(
    { playerAStoreCount, playerBStoreCount }: EndOfGameStoreCounts
  ) {
    const state = generateInitialGameState();

    state.playerB.houses = [0, 0, 0, 0, 0, 1];
    state.playerB.storeCount = playerBStoreCount;

    state.playerA.houses = [0, 0, 0, 0, 0, 1];
    state.playerA.storeCount = playerAStoreCount;

    return state;
  }

  function playLastMoveForPlayer(
    player: 'playerA' | 'playerB',
    initialState: GameState,
  ) {
    return reducer(initialState, {
      type: 'PLAY_HOUSE',
      player,
      houseIndex: 5
    })
  }
})

describe('state validation', () => {
  it('throws an error if there is a wrong number of game pieces', () => {
    const initialState = generateInitialGameState();
    expect(() => {
      reducer(initialState, {
        type: 'OVERRIDE_GAME_STATE',
        newState: {
          currentTurn: 'playerB',
          playerB: {
            houses: [0, 0, 0, 0, 0, 1],
            storeCount: 25,
          },
          playerA: {
            houses: [0, 0, 0, 0, 0, 1],
            storeCount: 22,
          },
          winner: null
        }
      })
    }).to.throw('invalid number of pieces in game state');
  })
})
