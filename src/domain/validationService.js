function isObject(obj) {
  return (typeof obj === 'object' && obj !== null && typeof obj !== 'function');
}

function validateConfigurationParam(config) {
  if (!config || (!config.secret && !config.jwksUri)) {
    throw new Error('Should pass either a public key from jwks (secret) or jwks-rsa configuration (jwksUri) configuration option to decode incoming JWT token.');
  }
  return;
}

function validateResParam(res) {
  if (!res || !isObject(res)) {
    throw new Error('Should pass res as function parameter.');
  }
  return;
}

module.exports = {
  validateConfigurationParam,
  validateResParam,
};
