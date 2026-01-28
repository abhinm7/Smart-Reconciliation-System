require('dotenv').config();
const { Worker } = require('bullmq');
const connectDB = require('../config/db');
const Upload = require('../models/Upload');
const { connection } = require('../config/redis');

connectDB();

const workHandler = async (job) => {
    const { jobId, type } = job.data;
    console.log(`starting job: ${jobId}`);

    try {
        await Upload.findByIdAndUpdate(jobId, { status: 'processing' });

        await new Promise(resolve => setTimeout(resolve, 10000));

        await Upload.findByIdAndUpdate(jobId, { status: 'completed' });
        console.log(`finished job: ${jobId}`);
    } catch (error) {
        console.error(`Job ${jobId} Failed:`, error.message);
        await UploadJob.findByIdAndUpdate(jobId, {
            status: 'FAILED',
            errorLog: [error.message]
        });
    }
}

const worker = new Worker('file-processing', workHandler, {
  connection,
  concurrency: 1
});

console.log('Worker is running...');