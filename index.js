const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

const getClient = opts => jwksClient({
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

const verifyToken = async function verifyToken({
  credentials,
  decodedToken,
  opts,
}) {
  return new Promise((resolve, reject) => {
    const client = getClient(opts);
    client.getSigningKey(decodedToken.header.kid, (err, key) => {
      if (err) {
        return reject(err);
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      return jwt.verify(credentials, signingKey, (error, decoded) => {
        if (err) {
          return reject(error);
        }
        return resolve(decoded);
      });
    });
  });
};

async function checkAuth(req, opts) {
  try {
    const credentials = getJWTFromAuthHeader(req);
    const decodedToken = decodeToken(credentials);
    const tokenInfo = await verifyToken({
      credentials,
      decodedToken,
      opts,
    });
    return tokenInfo;
  } catch (error) {
    throw error;
  }
}

module.exports = function init(opts) {
  const client = getClient(opts);
};
