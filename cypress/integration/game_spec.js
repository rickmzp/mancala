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

  it("distributes the stones when passing the opposite player's store", () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house1 button').click();
    cy.get('.playerB-house1 button').click();
    cy.get('.playerA-house2 button').click();
    cy.get('.playerB-house2 button').click();
    cy.get('.playerA-house3 button').click();
    cy.get('.playerB-house3 button').click();
    cy.get('.playerA-house4 button').click();
    cy.get('.playerB-house4 button').click();
    cy.get('.playerA-house5 button').click();

    boardHousesShouldLookLikeThis(
      [8, 9, 1, 2, 3, 3],
      [3, 2, 1, 1, 0, 8]
    );
    cy.get('.playerA-store').should('contain', '4');
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
