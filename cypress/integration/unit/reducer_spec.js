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
