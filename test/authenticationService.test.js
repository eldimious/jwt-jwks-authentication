const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const authenticationModule = require('../src/domain/authenticationService');

const {
  decodeToken
} = authenticationModule.init({});
const userEmail = 'test@gmail.com';
const userName = 'Dimos';
const userId = 1;
const jwtSecret = 'secret';
const token = jwt.sign({ email: 'test@gmail.com', name: 'Dimos', id: 1 }, 'secret');

describe('authentication service tests', () => {
  describe('test decodeToken method', () => {
    it('should return decodedToken without any error', async () => {
      const decodedToken = decodeToken(token);
      expect(decodedToken).to.not.be.undefined;
    });
    it('should return error', async () => {
      expect(decodeToken).to.throw();
    });
  });
});
