const validateConfiguration = function validateConfiguration(config) {
  if (!config || (!config.secret && !config.jwksUri)) {
    throw new Error('Should pass either a public key from jwks (secret) or jwks-rsa configuration (jwksUri) configuration option to decode incoming JWT token.');
  }
  return;
};

module.exports.validateConfiguration = validateConfiguration;
