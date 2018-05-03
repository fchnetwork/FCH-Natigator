describe('Render register', () => {
    it('Page title has Aerum', () => {
      cy
      .visit('/')
      .title()
      .should('contain', 'Aerum');
    });

    it('Button Continue disabled', () => {
        cy
            .get('[data-cy=continue]')
            .should('have.class', 'disabled')
    });

    it('Button Continue still disabled', () => {
        cy
            .get('[data-cy=password] div input')
            .type('HelloWorld')
        cy
            .get('[data-cy=repeat_password] div input')
            .type('HelloWorld1')
        cy
            .get('[data-cy=continue]')
            .should('have.class', 'disabled')
    });

    it('Button Continue Enabled', () => {
        cy
            .get('[data-cy=password] div input')
            .clear()
            .type('HelloWorld')
        cy
            .get('[data-cy=repeat_password] div input')
            .clear()
            .type('HelloWorld')
        cy
            .get('[data-cy=continue]')
            .should('not.have.class', 'disabled')
    });

    it('Check Restore an Account Router', () => {
        cy
            .contains('restore an account')
            .click({ force: true })
        cy
            .url()
            .should('include', '/account/restore')
    });
  });