# jwt-jwks-authentication

> Npm module that handles authentication. An Authorization header with value Bearer USER_TOKEN_HERE is expected to be present in all requests.
It retrieves RSA signing keys from a JWKS (JSON Web Key Set) endpoint if jwksUri provided, otherwise revifies and decodes token if
secret provided.


[![Build Status](https://travis-ci.org/eldimious/auth0-authentication
.svg?branch=master)](https://travis-ci.org/eldimious/auth0-authentication) [![Coverage Status](https://coveralls.io/repos/github/eldimious/auth0-authentication/badge.svg?branch=master)](https://coveralls.io/github/eldimious/auth0-authentication?branch=master)

## Usage

First, install `jwt-jwks-authentication` as a dependency:

```shell
npm install --jwt-jwks-authentication
```
