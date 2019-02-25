const authenticationServiceModule = require('./domain/authenticationService');

const validateConfiguration = function validateConfiguration(config) {
  if (!config || !config.jwksUri) {
    throw new Error('Add configuration object included jwksUri.');
  }
};

module.exports = function init(config) {
  try {
    validateConfiguration(config);
  } catch (error) {
    throw error;
  }
  const authenticationService = authenticationServiceModule.init(config);
  return Object.freeze({
    checkAuth: authenticationService.checkAuth,
  });
};
