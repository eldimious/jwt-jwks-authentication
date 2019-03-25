const { expect } = require('chai');
const {
  validateConfigurationParam,
  validateResParam,
} = require('../../src/domain/validationService');
const { mockResponse } = require('../mockedData');

const res = mockResponse();

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

  describe('test validateResParam method', () => {
    it('should return without any error, as we pass jwksUri', async () => {
      const fn = validateResParam(res);
      expect(fn).to.be.undefined;
    });
    it('should return throw error, res missing', async () => {
      expect(validateResParam).to.throw('Should pass res as function parameter.');
    });
    it('should return throw error, res not an object', async () => {
      expect(() => validateResParam(1)).to.throw('Should pass res as function parameter.');
    });
  });
});
