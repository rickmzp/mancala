import { Player } from '../../src/reducer';

type PlayerShorthand = 'A' | 'B';
type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6;
type House = {
  player: PlayerShorthand,
  houseNum: HouseNumber
};

describe('playing stones', () => {
  it('distributes the stones counter-clockwise', () => {
    cy.visit('./dist/index.html')

    play({ player: 'A', houseNum: 5 });
    boardStateShouldBe({
      B: { houses: [4, 4, 4, 4, 5, 5], store: 0 },
      A: { houses: [4, 4, 4, 4, 0, 5], store: 1 },
    });

    play({ player: 'B', houseNum: 6 });
    boardStateShouldBe({
      B: { houses: [0, 4, 4, 4, 5, 5], store: 1 },
      A: { houses: [5, 5, 5, 4, 0, 5], store: 1 },
    });
  });

  it('repeats the turn for a player if last stone ends in store', () => {
    cy.visit('./dist/index.html')

    play({ player: 'A', houseNum: 3 });
    boardStateShouldBe({
      B: { houses: [4, 4, 4, 4, 4, 4], store: 0 },
      A: { houses: [4, 4, 0, 5, 5, 5], store: 1 },
    });

    currentTurnShouldBeForPlayer('playerA');
    ensureNoPlayButtonFor({ player: 'A', houseNum: 3 });
  })
});

describe('ending the game', () => {
  it('displays the winner and removes button when the game is over', () => {
    cy.visit('./dist/index.html')

    cy.contains('Set game state to Player B about to win').click();

    cy.get('#game-message').should('be.empty')

    play({ player: 'B', houseNum: 6 });
    boardStateShouldBe({
      B: { houses: [0, 0, 0, 0, 0, 0], store: 25 },
      A: { houses: [0, 0, 0, 0, 0, 0], store: 23 },
    });

    cy.get('#game-message').should('have.text', 'Player B wins!')

    cy.get('[data-test-id=playButton]').should('have.length', 0)
  });
});

interface PlayAction {
  player: 'A' | 'B',
  houseNum: number,
}

function play({ player, houseNum }: PlayAction) {
  cy.get(
    `.player${player}-house${houseNum} button[data-test-id=playButton]`
  ).click();
}

interface ExpectedPlayerState {
  houses: Array<number>,
  store: number,
}

interface ExpectedPlayersState {
  A: ExpectedPlayerState,
  B: ExpectedPlayerState,
}

function boardStateShouldBe({ A, B }: ExpectedPlayersState) {
  cy.get(`.playerB-store`).should('have.text', B.store);
  B.houses.forEach((expectedCount: number, index: number) => {
    const number = 6 - index;
    cy.get(`.playerB-house${number} .count`).should('contain', expectedCount);
  });

  cy.get(`.playerA-store`).should('have.text', A.store);
  A.houses.forEach((expectedCount: number, index: number) => {
    const number = index + 1;
    cy.get(`.playerA-house${number} .count`).should('contain', expectedCount);
  });
};

function currentTurnShouldBeForPlayer(player: Player) {
  const opposingPlayer = player === 'playerA' ? 'playerB' : player;
  cy.get(`.${player}-house [data-test-id=playButton]`).should('have.length.of.at.least', 1);
  cy.get(`.${opposingPlayer}-house [data-test-id=playButton]`).should('have.length', 0);
}

function ensureNoPlayButtonFor({ player, houseNum }: House) {
  cy.get(
    `.player${player}-house${houseNum} [data-test-id=playButton]`
  ).should('have.length', 0);
}
