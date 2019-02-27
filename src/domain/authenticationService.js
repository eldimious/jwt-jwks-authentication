const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const ms = require('ms');

function init(opts) {
  const client = jwksClient({
    strictSsl: opts.cache || true,
    cache: opts.cache || true,
    rateLimit: opts.rateLimit || true,
    jwksRequestsPerMinute: opts.jwksRequestsPerMinute || 10,
    jwksUri: opts.jwksUri,
    cacheMaxAge: opts.cacheMaxAge || ms('10h'),
    cacheMaxEntries: opts.cacheMaxEntries || 5,
  });

  const decodeToken = (token) => {
    try {
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken) {
        throw new Error('decodeToken not found');
      }
      return decodedToken;
    } catch (e) {
      const msg = `Error decoded token with message: ${e.message}.`;
      throw new Error(msg);
    }
  };

  const getJWTFromHeader = function getJWTFromHeader(req) {
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

  const verifyRSAToken = async function verifyRSAToken(credentials, kid) {
    return new Promise((resolve, reject) => {
      client.getSigningKey(kid, (err, key) => {
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

  async function handleJWTWitFixedSecret(token) {
    const jwtInfo = await jwt.verify(token, opts.secret);
    return jwtInfo;
  }

  async function handleJWTWitRSA(token) {
    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        throw new Error('Decode token error.');
      }
      const kid = opts.kid || decodedToken.header.kid;
      const tokenInfo = await verifyRSAToken(token, kid);
      return tokenInfo;
    } catch (error) {
      throw error;
    }
  }

  async function checkAuth(req) {
    try {
      const credentials = getJWTFromHeader(req);
      if (opts.jwksUri) {
        return handleJWTWitRSA(credentials);
      }
      return handleJWTWitFixedSecret(credentials);
    } catch (error) {
      throw error;
    }
  }

  return Object.freeze({
    getJWTFromHeader,
    decodeToken,
    handleJWTWitFixedSecret,
    checkAuth,
  });
}

module.exports.init = init;
