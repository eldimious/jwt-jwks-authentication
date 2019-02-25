const authenticationServiceModule = require('./domain/authenticationService');

module.exports = function init(opts) {
  // validate opts.jwksUri
  const authenticationService = authenticationServiceModule.init(opts);
  return {
    checkAuth: authenticationService.checkAuth,
  };
};
