const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const authenticationModule = require('../src/domain/authenticationService');

const {
  decodeToken,
  getJWTFromHeader,
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
  describe('test getJWTFromHeader method', () => {
    it('should return error, missing req.', async () => {
      const err = 'Req object not found.';
      expect(getJWTFromHeader).to.throw(err);
    });
    it('should return error, missing req.headers.', async () => {
      const req = {
        headers: {},
      };
      expect(() => getJWTFromHeader(req)).to.throw('No authorization token found.');
    });
    it('should return error, token not found', async () => {
      const req = {
        headers: {
          authorization: 'test',
        },
      };
      expect(() => getJWTFromHeader(req)).to.throw('No authorization token found.');
    });
    it('should return error, bad credential format', async () => {
      const req = {
        headers: {
          authorization: 'test 12313',
        },
      };
      expect(() => getJWTFromHeader(req)).to.throw('Bad credential format.');
    });
  });
});
