describe('Render Unlock', () => {
    beforeEach(function () {
        cy.setCookie("aerum_keyStore", "%7B%22version%22%3A3%2C%22id%22%3A%22b9604e99-79df-4009-9fb2-c945ef3ff5e2%22%2C%22address%22%3A%2256220873fb32f35a27f5e0f6604fda2aef439a5f%22%2C%22crypto%22%3A%7B%22ciphertext%22%3A%22f35340d7026f88b676df656e85b721557f693494c4049e5611416c9395a2c772%22%2C%22cipherparams%22%3A%7B%22iv%22%3A%221e61f7f80ac4c232aca73f647685f352%22%7D%2C%22cipher%22%3A%22aes-128-ctr%22%2C%22kdf%22%3A%22scrypt%22%2C%22kdfparams%22%3A%7B%22dklen%22%3A32%2C%22salt%22%3A%22ce2d4918311f609cf3c6d091a5a0869273637ab486468b18ab92bd57808a4862%22%2C%22n%22%3A8192%2C%22r%22%3A8%2C%22p%22%3A1%7D%2C%22mac%22%3A%22641c574e9fdec8d40f6aeacab063a5bcc39d462007244b8c026c9f3d635b6396%22%7D%7D")
        cy.setCookie("aerum_base", "U2FsdGVkX1+bSh7AuWBo/5DnoW9cmCOiHsmraBvXIgXP+3Z07Ng8DJKd4lOqyF6jDgog6O8330pZnWRx1gywOxrgO0/W8/PZT53tZ4hs6Oss1lhZTXYw3TWVp0n2AnlU")
    })
    it('Page title has Aerum', () => {
      cy
      .visit('/account/unlock')
      .title()
      .should('contain', 'Aerum');
    });

    context('Unlock account', function () {

        it('Button Continue disabled', () => {
            cy
                .get('[data-cy=continue]')
                .should('have.class', 'disabled')
        });

        it('Button Continue Enabled', () => {
            cy
                .get('[data-cy=password] div input')
                .type('HelloWorld', { force: true })
            cy
                .get('[data-cy=continue]')
                .should('not.have.class', 'disabled')
        })


    })
    
});