const Redis = require('ioredis');

let connection;
const redis_url = process.env.REDIS_URL;

if (redis_url) {
    connection = new Redis(redis_url, { maxRetriesPerRequest: null });
} else {
    console.log("Redis url not found");
}

connection.on('connect', () => {
  console.log('Redis Connected');
});

connection.on('error', (err) => {
  console.error(`redis connection error:`, err.message);
});

module.exports = { connection };