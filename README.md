# auth0-authentication

> Npm module that handles authentication. An Authorization header with value Bearer USER_TOKEN_HERE is expected to be present in all requests.
It retrieves RSA signing keys from a JWKS (JSON Web Key Set) endpoint if jwksUri provided, otherwise revifies and decodes token if
secret provided.


[![Build Status](https://travis-ci.org/eldimious/throw-http-errors.svg?branch=master)](https://travis-ci.org/eldimious/throw-http-errors) [![Coverage Status](https://coveralls.io/repos/github/eldimious/throw-http-errors/badge.svg?branch=master)](https://coveralls.io/github/eldimious/throw-http-errors?branch=master)

## Usage

First, install `auth0-authentication` as a dependency:

```shell
npm install --auth0-authentication
```
