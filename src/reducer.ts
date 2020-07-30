interface PlayerGameState {
  houses: Array<number>;
  storeCount: number;
}

interface GameState {
  currentTurn: string;
  playerA: PlayerGameState;
  playerB: PlayerGameState;
}

type Player = 'playerA' | 'playerB';

interface GameAction {
  type: 'PLAY_HOUSE',
  houseIndex: number,
  player: Player
}

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
});

const playHouse = (state: GameState, index: number, player: Player) => {
  const opposingPlayer = player == 'playerA' ? 'playerB' : 'playerA'
  const currentPlayerState = state[player];
  const opponentPlayerState = state[opposingPlayer];
  const updatedCurrentPlayerHouses = currentPlayerState.houses;
  const updatedOpponentPlayerHouses = opponentPlayerState.houses;
  const totalDistributableBuckets = updatedCurrentPlayerHouses.length + updatedOpponentPlayerHouses.length + 1;
  let currentPlayerStoreCount = currentPlayerState.storeCount;
  let opponentPlayerStoreCount = opponentPlayerState.storeCount;

  const stonesCurrentlyInHouse = updatedCurrentPlayerHouses[index]
  updatedCurrentPlayerHouses[index] = 0;
  for (let i = 1; i <= stonesCurrentlyInHouse; i++) {
    const houseToIncrement = index + i;
    if (houseToIncrement == updatedCurrentPlayerHouses.length) {
      currentPlayerStoreCount++;
    } else if (houseToIncrement >= totalDistributableBuckets) {
      const mySideHouseToIncrement = houseToIncrement - totalDistributableBuckets;
      updatedCurrentPlayerHouses[mySideHouseToIncrement]++;
    } else if (houseToIncrement > updatedCurrentPlayerHouses.length) {
      const otherSideHouseToIncrement = houseToIncrement - updatedCurrentPlayerHouses.length - 1;
      updatedOpponentPlayerHouses[otherSideHouseToIncrement]++;
    } else {
      updatedCurrentPlayerHouses[houseToIncrement]++;
    }
  }

  const newState = generateInitialGameState();
  newState.currentTurn = opposingPlayer;
  newState[player] = {
    houses: updatedCurrentPlayerHouses,
    storeCount: currentPlayerStoreCount,
  }
  newState[opposingPlayer] = {
    houses: updatedOpponentPlayerHouses,
    storeCount: opponentPlayerStoreCount,
  }

  return newState;
}

export const reducer = (state: GameState, action: GameAction): GameState => {
  return playHouse(state, action.houseIndex, action.player);
}
