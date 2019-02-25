const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

function init(opts) {
  const client = jwksClient({
    cache: opts.cache || true,
    rateLimit: opts.rateLimit || true,
    jwksRequestsPerMinute: opts.requestsPerMinute || 10,
    jwksUri: opts.jwksUri,
  });

  const decodeToken = (token) => {
    let decodedToken;
    try {
      decodedToken = jwt.decode(token, { complete: true });
      return decodedToken;
    } catch (e) {
      throw new Error(`Error decoded token with message: ${e.message}.`);
    }
  };

  const getJWTFromAuthHeader = function getJWTFromAuthHeader(req) {
    if (!req) {
      throw new Error('Req object not found.');
    }
    if (!req.headers || !req.headers.authorization) {
      throw new Error('No authorization token found.');
    }
    const parts = req.headers.authorization.split(' ');
    if (parts.length !== 2) {
      throw new Error('No authorization token found.');
    }
    const [scheme, credentials] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      throw new Error('Bad credential format.');
    }
    return credentials;
  };

  const verifyToken = async function verifyToken(credentials, decodedToken) {
    return new Promise((resolve, reject) => {
      client.getSigningKey(decodedToken.header.kid, (err, key) => {
        if (err) {
          return reject(new Error(`Invalid user token with error message: ${err.message}`));
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        return jwt.verify(credentials, signingKey, (error, decoded) => {
          if (err) {
            return reject(new Error(`Invalid user token with error message: ${err.message}`));
          }
          if (!decoded) {
            return reject(new Error('Invalid user token'));
          }
          return resolve(decoded);
        });
      });
    });
  };

  async function checkAuth(req) {
    try {
      const credentials = getJWTFromAuthHeader(req);
      const decodedToken = decodeToken(credentials);
      if (!decodedToken) {
        throw new Error('Decode token error.');
      }
      const tokenInfo = await verifyToken(credentials, decodedToken);
      return tokenInfo;
    } catch (error) {
      throw error;
    }
  }

  return {
    checkAuth,
  };
}


module.exports.init = init;
