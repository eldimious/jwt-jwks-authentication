const authenticationServiceModule = require('./domain/authenticationService');
const {
  validateConfiguration,
} = require('./domain/validationService');
/*
  * @param {string} [config.jwksUri] jwks-rsa configuration object
  * @param {string} [config.kid] jwks-rsa fixed kid
  * @param {string} [config.secret] Fixed secret
  * @param {boolean} [config.rateLimit] Rare Limit to allow you to limit the number of calls that are made to the JWKS endpoint per minute
  * @param {number} [config.jwksRequestsPerMinute] Max number of calls that are made to the JWKS endpoint per minute
  * @param {boolean} [config.cache] In order to prevent a call to be made each time a signing key needs to be retrieved you can also configure a cache
  * @param {number} [config.cacheMaxAge] Max age that you can cache a key
  * @param {number} [config.cacheMaxEntries]
  * @param {boolean} [config.strictSsl]
*/
function init(config) {
  try {
    validateConfiguration(config);
  } catch (error) {
    throw error;
  }
  const authenticationService = authenticationServiceModule.init(config);
  return Object.freeze({
    checkAuth: authenticationService.checkAuth,
  });
}

module.exports = init;
