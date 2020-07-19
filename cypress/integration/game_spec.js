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

    cy.get('.playerA-house1 button').click();
    cy.get('.playerA-house1 .count').should('contain', '0');
    cy.get('.playerA-house2 .count').should('contain', '1');
    cy.get('.playerA-house3 .count').should('contain', '6');
    cy.get('.playerA-house4 .count').should('contain', '6');
    cy.get('.playerA-house5 .count').should('contain', '6');
    cy.get('.playerA-house6 .count').should('contain', '5');
    cy.get('.playerA-store').should('contain', '0');
  });

  it('stores a stone when it reaches the end');

  it('distributes the stones to the opposite player after reaching the end');
});
