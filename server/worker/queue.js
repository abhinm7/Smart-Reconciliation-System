const { Queue } = require('bullmq');
const { connection } = require('../config/redis');

const fileQueue = new Queue('file-processing', { 
  connection 
});

module.exports = { fileQueue };