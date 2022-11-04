'use strict';

const crypto = require('node:crypto');
const {crypto: cryptoConfig} = require('./config');

const hash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(cryptoConfig.randomBytes).toString(cryptoConfig.encoding);
  crypto.scrypt(password, salt, cryptoConfig.keyLength, (err, result) => {
    if (err) reject(err);
    resolve(salt + ':' + result.toString(cryptoConfig.encoding));
  });
});

module.exports = hash;
