const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Provider = db.define('provider', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  title: {
    type: Sequelize.ENUM,
    values: ['MD', 'RN', 'LPN', 'NP', 'PT', 'OT'],
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  specialty: {
    type: Sequelize.ENUM,
    values: [
      'Family Medicine',
      'Internal Medicine',
      'Pediatrics',
      'PM&R',
      'Preventative Medicine',
      'Psychiatry',
      'Dermatology',
      'Urology',
      'Surgery'
    ],
    allowNull: false
  },
  googleId: {
    type: Sequelize.STRING
  }
})

module.exports = Provider

/**
 * instanceMethods
 */
Provider.prototype.correctPassword = function(candidatePwd) {
  return Provider.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */
Provider.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

Provider.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = provider => {
  if (provider.changed('password')) {
    provider.salt = Provider.generateSalt()
    provider.password = Provider.encryptPassword(
      provider.password(),
      provider.salt()
    )
  }
}

Provider.beforeCreate(setSaltAndPassword)
Provider.beforeUpdate(setSaltAndPassword)
Provider.beforeBulkCreate(providers => {
  providers.forEach(setSaltAndPassword)
})
