const jwksClient = require('jwks-rsa');

const getClient = opts => jwksClient({
  cache: opts.cache || true,
  rateLimit: opts.rateLimit || true,
  jwksRequestsPerMinute: opts.requestsPerMinute || 10,
  jwksUri: opts.jwksUri,
});

module.exports = function init(opts) {
  const client = getClient(opts);
};


function verifyToken(token, cb) {
  let decodedToken;
  try {
    decodedToken = jwt.decode(token, {complete: true});
  } catch (e) {
    console.error(e);
    cb(e);
    return;
  }
  client.getSigningKey(decodedToken.header.kid, function (err, key) {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    jwt.verify(token, signingKey, function (err, decoded) {
      if (err) {
        console.error(err);
        cb(err);
        return
      }
      console.log(decoded);
      cb(null, decoded);
    });
  });
}

function checkAuth (fn) {
  return function (req, res) {
    if (!req.headers || !req.headers.authorization) {
      res.status(401).send('No authorization token found.');
      return;
    }
    const parts = req.headers.authorization.split(' ');
    if (parts.length != 2) {
      res.status(401).send('Bad credential format.');
      return;
    }
    const scheme = parts[0];
    const credentials = parts[1];

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).send('Bad credential format.');
      return;
    }
    verifyToken(credentials, function (err) {
      if (err) {
        res.status(401).send('Invalid token');
        return;
      }
      fn(req, res);
    });
  };
}
