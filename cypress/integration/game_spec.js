describe('playing stones', () => {
  it('distributes the stones counter-clockwise', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house2 button').click();
    boardHousesShouldLookLikeThis(
      [4, 4, 4, 4, 4, 4],
      [4, 0, 5, 5, 5, 5],
    );
    cy.get('.playerA-store').should('contain', '0');

    cy.get('.playerB-house6 button').click();
    boardHousesShouldLookLikeThis(
      [0, 4, 4, 4, 4, 4],
      [5, 1, 6, 5, 5, 5],
    );
    cy.get('.playerA-store').should('contain', '0');
  });

  it('repeats the turn for a player if last stone ends in store', () => {
    cy.visit('./dist/index.html')

    cy.get('.playerA-house3 button').click();
    cy.get('.playerA-store').should('contain', '1');
    cy.get('.playerB-store').should('contain', '0');
    boardHousesShouldLookLikeThis(
      [4, 4, 4, 4, 4, 4],
      [4, 4, 0, 5, 5, 5],
    );

    cy.get('.playerA-house [data-test-id=playButton]').should('have.length', 6);
    cy.get('.playerB-house [data-test-id=playButton]').should('have.length', 0);
  })

  it('stores a stone when it reaches the end', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house3 button').click();
    boardHousesShouldLookLikeThis(
      [4, 4, 4, 4, 4, 4],
      [4, 4, 0, 5, 5, 5]
    );
    cy.get('.playerA-store').should('contain', '1');
    cy.get('.playerB-store').should('contain', '0');
  });

  it('distributes the stones to the opposite player after reaching the end', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house4 button').click();
    boardHousesShouldLookLikeThis(
      [4, 4, 4, 4, 4, 5],
      [4, 4, 4, 0, 5, 5]
    );
    cy.get('.playerA-store').should('contain', '1');
    cy.get('.playerB-store').should('contain', '0');
  });

  // TODO: can we push this down into unit tests?
  it("distributes the stones when passing the opposite player's store", () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house1 button').click();
    cy.get('.playerB-house1 button').click();
    cy.get('.playerA-house2 button').click();
    cy.get('.playerA-house3 button').click();
    cy.get('.playerB-house2 button').click();
    cy.get('.playerA-house4 button').click();
    cy.get('.playerB-house3 button').click();
    cy.get('.playerA-house5 button').click();
    cy.get('.playerB-house6 button').click();
    cy.get('.playerA-house6 button').click(); // play a house with >= 8 stones

    boardHousesShouldLookLikeThis(
      [1, 9, 10, 2, 3, 4],
      [4, 3, 2, 1, 1, 0]
    );
    cy.get('.playerA-store').should('contain', '5');
    cy.get('.playerB-store').should('contain', '3');
  });

  const boardHousesShouldLookLikeThis = (playerB, playerA) => {
    playerB.forEach((expectedCount, index) => {
      const number = 6 - index;
      cy.get(`.playerB-house${number} .count`).should('contain', expectedCount);
    });

    playerA.forEach((expectedCount, index) => {
      const number = index + 1;
      cy.get(`.playerA-house${number} .count`).should('contain', expectedCount);
    });
  };
});

describe('ending the game', () => {
  it('allows player B to win', () => {
    cy.visit('./dist/index.html')

    cy.contains('Set game state to Player B about to win').click();

    cy.get('#game-message').should('be.empty')

    cy.get('.playerB-house6 [data-test-id=playButton]').click();

    cy.get('#game-message').should('have.text', 'Player B wins!')
    cy.get('.playerB-store').should('have.text', '25')
    cy.get('.playerA-store').should('have.text', '23')

    cy.get('[data-test-id=playButton]').should('have.length', 0)
  });

  // TODO: push this test down into unit tests
  it('allows player A to win', () => {
    cy.visit('./dist/index.html')

    cy.contains('Set game state to Player A about to win').click();

    cy.get('#game-message').should('be.empty')

    cy.get('.playerA-house6 button').click();

    cy.get('#game-message').should('contain.text', 'Player A wins!')
    cy.get('.playerA-store').should('have.text', '25')
    cy.get('.playerB-store').should('have.text', '23')

    cy.get('[data-test-id=playButton]').should('have.length', 0)
  });

  // TODO: push this test down into unit tests
  it('allows game to end in a tie', () => {
    cy.visit('./dist/index.html')

    cy.contains('Set game state to Player A about to tie').click();

    cy.get('#game-message').should('be.empty')

    cy.get('.playerA-house6 button').click();

    cy.get('#game-message').should('contain.text', 'Game is a tie!')
    cy.get('.playerA-store').should('have.text', '24')
    cy.get('.playerB-store').should('have.text', '24')

    cy.get('[data-test-id=playButton]').should('have.length', 0)
  });
});
