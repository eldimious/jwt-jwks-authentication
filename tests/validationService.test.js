const { expect } = require('chai');
const {
  validateConfigurationParam,
} = require('../src/domain/validationService');

describe('validation service tests', () => {
  describe('test validateConfigurationParam method', () => {
    it('should return without any error, as we pass jwksUri', async () => {
      const fn = validateConfigurationParam({
        jwksUri: 'https://test.com',
      });
      expect(fn).to.be.undefined;
    });
    it('should return without any error, as we pass secret', async () => {
      const fn = validateConfigurationParam({
        secret: 'test',
      });
      expect(fn).to.be.undefined;
    });
    it('should return throw error, bad config', async () => {
      const fn = validateConfigurationParam({
        secret: 'test',
      });
      expect(validateConfigurationParam).to.throw('Should pass either a public key from jwks (secret) or jwks-rsa configuration (jwksUri) configuration option to decode incoming JWT token.');
    });
  });
});
