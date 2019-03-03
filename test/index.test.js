const { expect } = require('chai');
const authenticationFactory = require('../src');

describe('authentication module tests', () => {
  describe('test exported module', () => {
    it('should return method', async () => {
      const authentication = authenticationFactory({
        secret: 'secret',
      });
      expect(authentication).to.not.be.undefined;
      expect(authentication).to.be.an('object');
      expect(typeof(authentication.checkAuth)).to.eql('function');
    });
    it('should return validation error', async () => {
      const err = 'Should pass either a public key from jwks (secret) or jwks-rsa configuration (jwksUri) configuration option to decode incoming JWT token.';
      expect(authenticationFactory).to.throw(err);
    });
  });
});
