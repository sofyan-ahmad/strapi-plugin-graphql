const _ = require('lodash');

const redisClient = (strapi) => {
  const config = _.get(strapi.plugins.graphql, 'config', {});


  const _redisClient = _.get(config, 'redisClient', {
    get: () => null,
    set: () => null,
    del: () => null,
  });

  return _redisClient;
};

module.exports = redisClient;
