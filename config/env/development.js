var config = {
  endpoint: 'http://localhost:8081/v1',
  port: 8081,
  db: {
    uri: 'mongodb://localhost/overview-api-test'
  },
  auth: {
    token_ttl: 604800000,
    token_reset_ttl: 3600000
  }
};

module.exports = config;
