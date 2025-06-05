describe('Team Challenge Game Flow', () => {
  beforeEach(() => {
    // Reset game state and visit the app
    cy.visit('/');
    cy.intercept('POST', '/api/teams/create').as('createTeam');
    cy.intercept('GET', '/api/questions*').as('getQuestions');
    cy.intercept('PATCH', '/api/teams/*/score').as('updateScore');
  });

  it('completes a full game flow successfully', () => {
    // 1. Team Creation
    cy.get('[data-cy=team-name-input]').type('Cypress Test Team');
    cy.get('[data-cy=create-team-button]').click();
    cy.wait('@createTeam').its('response.statusCode').should('eq', 201);
    cy.get('[data-cy=team-dashboard]').should('contain', 'Cypress Test Team');

    // 2. Start Game
    cy.get('[data-cy=start-game-button]').click();
    cy.wait('@getQuestions');

    // 3. Answer Questions and Use Help Aids
    // First question - answer correctly
    cy.get('[data-cy=question-text]').should('be.visible');
    cy.get('[data-cy=answer-option]').first().click();
    cy.wait('@updateScore');
    cy.get('[data-cy=score-display]').should('not.equal', '0');
    cy.get('[data-cy=streak-counter]').should('contain', '1');

    // Second question - use 50:50 help aid
    cy.get('[data-cy=fifty-fifty-button]').click();
    cy.get('[data-cy=answer-option]').should('have.length', 2);
    cy.get('[data-cy=answer-option]').last().click();
    cy.wait('@updateScore');

    // Third question - use skip help aid
    cy.get('[data-cy=skip-button]').click();
    cy.wait('@getQuestions');
    cy.get('[data-cy=question-text]')
      .invoke('text')
      .should('not.equal', '');

    // Fourth question - use time freeze
    cy.get('[data-cy=time-freeze-button]').click();
    cy.get('[data-cy=timer-display]').should('have.class', 'paused');
    cy.get('[data-cy=answer-option]').first().click();
    cy.wait('@updateScore');

    // 4. Verify Leaderboard Updates
    cy.get('[data-cy=leaderboard]').within(() => {
      cy.get('[data-cy=leaderboard-entry]')
        .first()
        .should('contain', 'Cypress Test Team');
    });

    // 5. Verify Help Aid Management
    cy.get('[data-cy=help-aids]').within(() => {
      cy.get('[data-cy=skip-count]').should('contain', '2');
      cy.get('[data-cy=fifty-fifty-count]').should('contain', '2');
      cy.get('[data-cy=time-freeze-count]').should('contain', '2');
    });

    // 6. Test Streak Mechanics
    // Answer three questions correctly in a row
    for (let i = 0; i < 3; i++) {
      cy.get('[data-cy=answer-option]').first().click();
      cy.wait('@updateScore');
      cy.get('[data-cy=streak-counter]').should('contain', `${i + 2}`);
    }

    // Verify streak multiplier
    cy.get('[data-cy=multiplier-display]').should('contain', '1.6x');

    // 7. Test Timer Functionality
    cy.get('[data-cy=timer-display]').should('be.visible');
    cy.get('[data-cy=timer-display]').should('contain', '45');

    // Wait for timer to decrease
    cy.get('[data-cy=timer-display]')
      .invoke('text')
      .then(parseInt)
      .should('be.lessThan', 45);

    // 8. End Game
    cy.get('[data-cy=end-game-button]').click();
    cy.get('[data-cy=final-score]').should('be.visible');
    cy.get('[data-cy=play-again-button]').should('be.visible');
  });

  it('handles network errors gracefully', () => {
    // Simulate network error during team creation
    cy.intercept('POST', '/api/teams/create', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('createTeamError');

    cy.get('[data-cy=team-name-input]').type('Error Test Team');
    cy.get('[data-cy=create-team-button]').click();
    cy.wait('@createTeamError');
    cy.get('[data-cy=error-message]').should('be.visible');
  });

  it('enforces game rules correctly', () => {
    // Create team and start game
    cy.get('[data-cy=team-name-input]').type('Rules Test Team');
    cy.get('[data-cy=create-team-button]').click();
    cy.wait('@createTeam');
    cy.get('[data-cy=start-game-button]').click();

    // Verify help aid limits
    for (let i = 0; i < 4; i++) {
      if (i < 3) {
        cy.get('[data-cy=skip-button]').should('be.enabled').click();
        cy.wait('@getQuestions');
      } else {
        cy.get('[data-cy=skip-button]').should('be.disabled');
      }
    }

    // Verify streak reset on wrong answer
    // Build up streak
    for (let i = 0; i < 2; i++) {
      cy.get('[data-cy=answer-option]').first().click();
      cy.wait('@updateScore');
    }
    cy.get('[data-cy=streak-counter]').should('contain', '2');

    // Give wrong answer
    cy.get('[data-cy=answer-option]').last().click();
    cy.wait('@updateScore');
    cy.get('[data-cy=streak-counter]').should('contain', '0');
  });
});