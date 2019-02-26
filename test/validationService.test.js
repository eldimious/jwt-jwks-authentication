const { expect } = require('chai');
const {
  validateConfiguration,
} = require('../src/domain/validationService');

describe('validation service tests', function () {
  describe('test validateConfiguration method', function () {
    it('should return without any error', async function () {
      const fn = validateConfiguration({
        jwksUri: 'https://test.com',
      })
      expect(fn).to.be.undefined;
    });
  });
});
