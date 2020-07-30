interface PlayerGameState {
  houses: Array<number>;
  storeCount: number;
}

export interface GameState {
  currentTurn: string;
  playerA: PlayerGameState;
  playerB: PlayerGameState;
  winner?: string;
}

export type Player = 'playerA' | 'playerB';
type HouseIndex = 0 | 1 | 2 | 3 | 4 | 5;


type PlayHouseAction = {
  type: 'PLAY_HOUSE',
  houseIndex: HouseIndex,
  player: Player
}

type OverrideGameStateAction = {
  type: 'OVERRIDE_GAME_STATE',
  newState: GameState,
}

type GameAction = PlayHouseAction | OverrideGameStateAction;

export const generateInitialGameState = (): GameState =>  ({
  currentTurn: 'playerA',
  playerA: {
    houses: [4, 4, 4, 4, 4, 4],
    storeCount: 0,
  },
  playerB: {
    houses: [4, 4, 4, 4, 4, 4],
    storeCount: 0,
  },
  winner: null,
});

const playHouse = (state: GameState, index: HouseIndex, player: Player) => {
  const opposingPlayer = player == 'playerA' ? 'playerB' : 'playerA'
  const currentPlayerState = state[player];
  const opponentPlayerState = state[opposingPlayer];
  const updatedCurrentPlayerHouses = currentPlayerState.houses;
  const updatedOpponentPlayerHouses = opponentPlayerState.houses;
  const totalDistributableBuckets = updatedCurrentPlayerHouses.length + updatedOpponentPlayerHouses.length + 1;
  let currentPlayerStoreCount = currentPlayerState.storeCount;
  let opponentPlayerStoreCount = opponentPlayerState.storeCount;
  let repeatTurn = false;

  const stonesCurrentlyInHouse = updatedCurrentPlayerHouses[index]
  updatedCurrentPlayerHouses[index] = 0;
  for (let i = 1; i <= stonesCurrentlyInHouse; i++) {
    let houseToIncrement = index + i;
    if (houseToIncrement >= totalDistributableBuckets)
      houseToIncrement = houseToIncrement - totalDistributableBuckets;

    if (houseToIncrement == updatedCurrentPlayerHouses.length) {
      currentPlayerStoreCount++;
      if (i === stonesCurrentlyInHouse) repeatTurn = true;
    } else if (houseToIncrement >= totalDistributableBuckets) {
      // TODO: figure out how to get rid of this branch which serves almost the
      //       same purpose as the "else" branch
      const mySideHouseToIncrement = houseToIncrement - totalDistributableBuckets;
      updatedCurrentPlayerHouses[mySideHouseToIncrement]++;
    } else if (houseToIncrement > updatedCurrentPlayerHouses.length) {
      const otherSideHouseToIncrement = houseToIncrement - updatedCurrentPlayerHouses.length - 1;
      updatedOpponentPlayerHouses[otherSideHouseToIncrement]++;
    } else {
      const landedOnEmptyHouse = updatedCurrentPlayerHouses[houseToIncrement] === 0;
      updatedCurrentPlayerHouses[houseToIncrement]++;
      if (i === stonesCurrentlyInHouse && landedOnEmptyHouse) {
        // TODO: extract this to some sort of capture function
        const opposingPlayersOppositeHouse = 5 - houseToIncrement;
        const opposingPlayersOppositeHouseCount =
          updatedOpponentPlayerHouses[opposingPlayersOppositeHouse];
        updatedOpponentPlayerHouses[opposingPlayersOppositeHouse] = 0;
        const currentPlayersLandingHouseCount =
          updatedCurrentPlayerHouses[houseToIncrement];
        updatedCurrentPlayerHouses[houseToIncrement] = 0;
        currentPlayerStoreCount = currentPlayerStoreCount +
          opposingPlayersOppositeHouseCount +
          currentPlayersLandingHouseCount;
      };
    }
  }

  const newState = generateInitialGameState();
  newState.currentTurn = repeatTurn ? player : opposingPlayer;
  newState[player] = {
    houses: updatedCurrentPlayerHouses,
    storeCount: currentPlayerStoreCount,
  }
  newState[opposingPlayer] = {
    houses: updatedOpponentPlayerHouses,
    storeCount: opponentPlayerStoreCount,
  }

  // current player has run out of stones, end the game
  if (newState[player].houses.every((count) => count == 0)) {
    // take all of opposing player's stones and add to their store count
    newState[opposingPlayer].houses.forEach((houseCount, index) => {
      newState[opposingPlayer].storeCount += houseCount;
      newState[opposingPlayer].houses[index] = 0;
    });

    if (newState[player].storeCount > newState[opposingPlayer].storeCount) {
      newState.winner = player;
    } else if (newState[player].storeCount < newState[opposingPlayer].storeCount) {
      newState.winner = opposingPlayer;
    } else {
      newState.winner = 'tie';
    }

    newState.currentTurn = null;
  }

  return newState;
}

export const reducer = (state: GameState, action: GameAction): GameState => {
  let newState;
  switch (action.type) {
    case 'PLAY_HOUSE':
      newState = playHouse(state, action.houseIndex, action.player);
      break;
    case 'OVERRIDE_GAME_STATE':
      newState = action.newState;
      break;
  }

  if (
    newState.playerA.houses.reduce((total, count) => total + count) +
      newState.playerA.storeCount +
      newState.playerB.houses.reduce((total, count) => total + count) +
      newState.playerB.storeCount !== 48
  ) throw new Error('invalid number of pieces in game state');

  return newState;
}

export default reducer;
