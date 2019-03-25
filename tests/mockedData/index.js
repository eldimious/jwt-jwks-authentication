const { spy, stub } = require('sinon');

const mockRequest = (options = {}) => ({
  body: {},
  cookies: {},
  query: {},
  params: {},
  get: stub(),
  ...options,
});

const mockResponse = (options = {}) => {
  const res = {
    cookie: spy(),
    clearCookie: spy(),
    download: spy(),
    format: spy(),
    json: spy(),
    jsonp: spy(),
    message: null,
    send(msg) {
      this.message = msg;
      return this;
    },
    sendFile: spy(),
    sendStatus: spy(),
    redirect: spy(),
    render: spy(),
    end: spy(),
    set: spy(),
    type: spy(),
    get: stub(),
    code: null,
    status(status) {
      this.code = status;
      return this;
    },
    ...options,

  };
  res.vary = stub().returns(res);
  return res;
};

module.exports = {
  mockRequest,
  mockResponse,
};
