# Strapi GraphQL With Cache capability

This plugin is forked from https://github.com/strapi/strapi/tree/master/packages/strapi-plugin-graphql

This plugin will add GraphQL functionality to your app with cache capability.
By default it will provide you with most of the CRUD methods exposed in the Strapi REST API.

To learn more about GraphQL in Strapi [visit documentation](https://strapi.io/documentation/developer-docs/latest/development/plugins/graphql.html)

## Why this exist?

Official graphql plugin is very slow, especially if you try to fetch nested with more than 3 levels.
This plugin will make query runs much faster. From my personal benchmark, it improves from 8 second to 200ms.

## Installation 
```bash
npm i --save https://github.com/sofyan-ahmad/strapi-plugin-graphql
```

## Configuration
1. create file under directory: `extensions/graphql/config/settings.js`
2. Add this code to the file content:

```javascript
const redis = require('redis');
const redisMock = require('redis-mock');
const { promisifyAll } = require('bluebird');

if (process.env.NODE_ENV !== 'test') {
  promisifyAll(redis);
} else {
  promisifyAll(redisMock);
}

const client =
  process.env.NODE_ENV !== 'test' ?
    redis.createClient({
      host: process.env.CACHE_HOST || '127.0.0.1',
      port: process.env.CACHE_PORT || 6379,
    }) : redisMock.createClient();

const redisClient = {
  set: async (key, value) => client.setAsync(`my-service:${key}`, value),
  get: async (key) => client.getAsync(`my-service:${key}`),
  del: async (prefix) => {
    const keys = await client.keysAsync(`my-service:${prefix}*`);

    await Promise.all(
      keys.map(async (key) => {
        await client.delAsync(key);
      }),
    );
  },
};

module.exports = {
  redisClient,
};

```