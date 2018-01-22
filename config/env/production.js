var config = {
  endpoint: 'http://localhost:8080/v1',
  port: 8080,
  db: {
    uri: 'mongodb://localhost/overview-api'
  },
  auth: {
    token_ttl: 604800000,
    token_reset_ttl: 3600000
  }
};

module.exports = config;
