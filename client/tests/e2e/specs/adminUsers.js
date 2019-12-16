/*
Add user in users list
Add user with an exiting email
Cancel Archive user
Archive user
*/

describe('Create and see users', () => {
  const repartiteurEmail1 = 'repartiteur1@example.com'
  const repartiteurEmail2 = 'repartiteur2@example.com'
  const repartiteurEmail3 = 'repartiteur3@example.com'
  const repartiteurEmail4 = 'repartiteur4@example.com'
  const repartiteurEmail5 = 'repartiteur5@example.com'
  const repartiteurEmail6 = 'repartiteur6@example.com'

  before(() => {
    cy.deleteAllMails()
  })

  beforeEach(() => {
    cy.adminLogin()
  })

  afterEach(() => {
    cy.adminDisconnection()
  })

  it('Should create a new user', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail1)

    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()

    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)
    cy.get('.t-list-email')
      .should('contain', repartiteurEmail1)
  })

  it('Should not create a user with existing email', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail2)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()
    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)

    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail2)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()

    cy.get('.v-snack')
      .should('contain', `Impossible de créer l'utilisateur : l'email existe déjà`)
  })

  it('Should not archive user if cancel archive users', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail3)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()
    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)

    cy.get('.t-list-email')
      .should('contain', repartiteurEmail3)

    cy.get('.t-list-email')
      .contains(repartiteurEmail3)
      .parents('.t-list')
      .find('.t-btn-delete')
      .click()
    cy.get('.t-btn-cancel-delete')
      .click()

    cy.get('.t-list-email')
      .should('contain', repartiteurEmail3)
  })

  it('Should archive existing user', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail4)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()
    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)

    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-list-email')
      .should('contain', repartiteurEmail4)

    cy.get('.t-list-email')
      .contains(repartiteurEmail4)
      .parents('.t-list')
      .find('.t-btn-delete')
      .click()
    cy.get('.t-btn-delete-confirm')
      .click()

    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été archivé`)

    cy.get('.t-list-email')
      .should('not.contain', repartiteurEmail4)
  })

  it('Should update status and/or departements user', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail5)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.get('.t-create-btn')
      .click()
    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)

    cy.get('.t-list-email')
      .should('contain', repartiteurEmail5)
      .contains(repartiteurEmail5)
      .parents('.t-list')
      .find('.t-btn-update')
      .click()
    cy.get('.t-select-update-status')
      .click()
    cy.contains(Cypress.env('delegue'))
      .click()
    cy.get('.t-select-update-departements')
      .click()
    cy.contains('93')
      .click()
    cy.get('.t-title-update')
      .click()
    cy.get('.t-btn-update-confirm')
      .click()

    cy.get('.v-snack')
      .should('contain', `L'utilisateur ${repartiteurEmail5} a bien été modifié`)
  })

  it('Should not update status and/or departements of user', () => {
    cy.visit(Cypress.env('frontAdmin') + 'admin/users')
    cy.get('.t-input-email [type=text]')
      .type(repartiteurEmail6)
    cy.get('.t-select-status')
      .click()
    cy.contains(Cypress.env('repartiteur'))
      .click()
    cy.get('.t-select-departements')
      .click()
    cy.contains('75')
      .click()
    cy.get('.t-create-btn')
      .click()
    cy.get('.v-snack')
      .should('contain', `L'utilisateur a bien été créé`)

    cy.get('.t-list-email')
      .should('contain', repartiteurEmail6)
      .contains(repartiteurEmail6)
      .parents('.t-list')
      .find('.t-btn-update')
      .click()
    cy.get('.t-btn-cancel-update')
      .click()

    cy.get('.t-list-email')
      .should('contain', repartiteurEmail6)
  })
})
