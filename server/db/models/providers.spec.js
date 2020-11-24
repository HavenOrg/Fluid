/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const Provider = db.model('provider')

describe('Provider model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  // it('should have a lastname', () => {
  //     let lastname = ''
  //     expect(lastname).to.be.a('string')
  // })
  // it('Title should only include these values', () => {
  //     let titles = ['MD', 'RN', 'LPN', 'NP', 'PT', 'OT']
  //     expect(titles).to.include('MD', 'RN', 'LPN', 'NP', 'PT', 'OT')
  // })
  // it('Specialty should only include these values', () => {
  //     let specialties = ['Family Medicine',
  //         'Internal Medicine',
  //         'Pediatrics',
  //         'PM&R',
  //         'Preventative Medicine',
  //         'Psychiatry',
  //         'Dermatology',
  //         'Urology',
  //         'Surgery']
  //     expect(specialties).to.include('Family Medicine',
  //         'Internal Medicine',
  //         'Pediatrics',
  //         'PM&R',
  //         'Preventative Medicine',
  //         'Psychiatry',
  //         'Dermatology',
  //         'Urology',
  //         'Surgery')
  // })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody

      beforeEach(async () => {
        cody = await Provider.create({
          email: 'kp@kp.com',
          firstName: 'Jane',
          lastName: 'Doe',
          title: 'MD',
          specialty: 'Pediatrics',
          password: 'bones'
        })
      })

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false)
      })
    }) // end describe('correctPassword')
    it('has field for names', async () => {
      const provider = await Provider.build({
        email: 'kp@kp.com',
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'MD',
        specialty: 'Pediatrics'
      })
      expect(provider.email).to.equal('kp@kp.com')
      expect(provider.firstName).to.equal('Jane')
      expect(provider.lastName).to.equal('Doe')
      expect(provider.title).to.equal('MD')
      expect(provider.specialty).to.equal('Pediatrics')
    })
  }) // end describe('instanceMethods')
}) // end describe('Provider model')
