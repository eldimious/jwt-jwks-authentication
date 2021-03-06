const chai = require('chai');
require('dotenv').config();
const chaiAsPromised = require('chai-as-promised');
const jwt = require('jsonwebtoken');
const authenticationFactory = require('../src');
const { mockRequest, mockResponse } = require('./mockedData');

chai.use(chaiAsPromised);
const {
  expect,
} = chai;

const userEmail = 'test@gmail.com';
const userName = 'Dimos';
const userId = 1;
const jwtSecret = 'secret';
const token = jwt.sign({ email: 'test@gmail.com', name: 'Dimos', id: 1 }, jwtSecret);
let req;
let res;


describe('authentication module tests', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });
  describe('test exported module', () => {
    it('should return verify method', async () => {
      const authentication = authenticationFactory({
        secret: 'secret',
      });
      expect(authentication).to.not.be.undefined;
      expect(authentication).to.be.an('object');
      expect(typeof(authentication.verify)).to.eql('function');
      expect(typeof(authentication.authorize)).to.eql('function');
    });
    it('should return validation error', async () => {
      const err = 'Should pass either a public key from jwks (secret) or jwks-rsa configuration (jwksUri) configuration option to decode incoming JWT token.';
      expect(authenticationFactory).to.throw(err);
    });
    describe('test verify function', () => {
      it('should return token without error', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        expect(typeof(authentication.verify)).to.eql('function');
        const decodedToken = await authentication.verify(req);
        expect(decodedToken).to.not.be.undefined;
        expect(decodedToken).to.be.an('object');
        expect(decodedToken.email).to.equal(userEmail);
        expect(decodedToken.name).to.equal(userName);
        expect(decodedToken.id).to.equal(userId);
      });
      it('should return error', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
          },
        };
        await expect(authentication.verify(req)).to.eventually.be.rejectedWith(Error);
      });
    });
    describe('test verify function using jwks', () => {
      it('should return token without error', async () => {
        const authentication = authenticationFactory({
          jwksUri: process.env.JWKS_URL,
        });
        req = {
          headers: {
            authorization:`Bearer ${process.env.JWT}`,
          },
        };
        expect(typeof(authentication.verify)).to.eql('function');
        const decodedToken = await authentication.verify(req);
        expect(decodedToken).to.not.be.undefined;
        expect(decodedToken).to.be.an('object');
        expect(decodedToken.iss).to.equal(process.env.AUTH0_URL);
      });
      it('should return error', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
          },
        };
        await expect(authentication.verify(req)).to.eventually.be.rejectedWith(Error);
      });
    });
    describe('test authorize function', () => {
      it('should return error, not passing res', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await expect(authentication.authorize(req)).to.eventually.be.rejectedWith(Error);
      });
      it('should return error, not passing correct req - missing authorization header', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
          },
        };
        await authentication.authorize(req, res);
        expect(res.code).to.eql(401);
        expect(res.message).to.eql('No authorization token found.');
      });
      it('should return token without error and passing info to res.user object', async () => {
        const authentication = authenticationFactory({
          secret: 'secret',
        });
        req = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await authentication.authorize(req, res);
        expect(req.user).to.be.an('object');
        expect(req.user.email).to.equal(userEmail);
        expect(req.user.name).to.equal(userName);
        expect(req.user.id).to.equal(userId);
      });
    });
  });
});
