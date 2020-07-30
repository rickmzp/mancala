describe('playing stones', () => {
  it('distributes the stones counter-clockwise', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house2 button').click();
    cy.get('.playerA-house1 .count').should('contain', '4');
    cy.get('.playerA-house2 .count').should('contain', '0');
    cy.get('.playerA-house3 .count').should('contain', '5');
    cy.get('.playerA-house4 .count').should('contain', '5');
    cy.get('.playerA-house5 .count').should('contain', '5');
    cy.get('.playerA-house6 .count').should('contain', '5');
    cy.get('.playerA-store').should('contain', '0');

    cy.get('.playerB-house6 button').click();
    cy.get('.playerA-house1 .count').should('contain', '5');
    cy.get('.playerA-house2 .count').should('contain', '1');
    cy.get('.playerA-house3 .count').should('contain', '6');
    cy.get('.playerA-house4 .count').should('contain', '5');
    cy.get('.playerA-house5 .count').should('contain', '5');
    cy.get('.playerA-house6 .count').should('contain', '5');
    cy.get('.playerA-store').should('contain', '0');
  });

  it('stores a stone when it reaches the end', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house3 button').click();
    cy.get('.playerA-house1 .count').should('contain', '4');
    cy.get('.playerA-house2 .count').should('contain', '4');
    cy.get('.playerA-house3 .count').should('contain', '0');
    cy.get('.playerA-house4 .count').should('contain', '5');
    cy.get('.playerA-house5 .count').should('contain', '5');
    cy.get('.playerA-house6 .count').should('contain', '5');
    cy.get('.playerA-store').should('contain', '1');
    cy.get('.playerB-house1 .count').should('contain', '4');
    cy.get('.playerB-house2 .count').should('contain', '4');
    cy.get('.playerB-house3 .count').should('contain', '4');
    cy.get('.playerB-house4 .count').should('contain', '4');
    cy.get('.playerB-house5 .count').should('contain', '4');
    cy.get('.playerB-house6 .count').should('contain', '4');
    cy.get('.playerB-store').should('contain', '0');
  });

  it('distributes the stones to the opposite player after reaching the end', () => {
    cy.visit('./dist/index.html')

    // TODO: is there a better matcher than contains?
    cy.get('.playerA-house4 button').click();
    cy.get('.playerA-house1 .count').should('contain', '4');
    cy.get('.playerA-house2 .count').should('contain', '4');
    cy.get('.playerA-house3 .count').should('contain', '4');
    cy.get('.playerA-house4 .count').should('contain', '0');
    cy.get('.playerA-house5 .count').should('contain', '5');
    cy.get('.playerA-house6 .count').should('contain', '5');
    cy.get('.playerA-store').should('contain', '1');
    cy.get('.playerB-house1 .count').should('contain', '5');
    cy.get('.playerB-house2 .count').should('contain', '4');
    cy.get('.playerB-house3 .count').should('contain', '4');
    cy.get('.playerB-house4 .count').should('contain', '4');
    cy.get('.playerB-house5 .count').should('contain', '4');
    cy.get('.playerB-house6 .count').should('contain', '4');
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

    cy.get('.playerA-house1 .count').should('contain', '3');
    cy.get('.playerA-house2 .count').should('contain', '2');
    cy.get('.playerA-house3 .count').should('contain', '1');
    cy.get('.playerA-house4 .count').should('contain', '1');
    cy.get('.playerA-house5 .count').should('contain', '0');
    cy.get('.playerA-house6 .count').should('contain', '8');
    cy.get('.playerA-store').should('contain', '4');
    cy.get('.playerB-house1 .count').should('contain', '3');
    cy.get('.playerB-house2 .count').should('contain', '3');
    cy.get('.playerB-house3 .count').should('contain', '2');
    cy.get('.playerB-house4 .count').should('contain', '1');
    cy.get('.playerB-house5 .count').should('contain', '9');
    cy.get('.playerB-house6 .count').should('contain', '8');
    cy.get('.playerB-store').should('contain', '3');
  });
});
