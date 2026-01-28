require('dotenv').config();
const { Worker } = require('bullmq');
const connectDB = require('../config/db');
const Upload = require('../models/Upload');
const { connection } = require('../config/redis');
const { processSystemData } = require('./processors');

connectDB();

const workHandler = async (job) => {
    const { jobId, type, filePath } = job.data;
    console.log(`starting job: ${jobId}`);

    try {
        await Upload.findByIdAndUpdate(jobId, { status: 'processing' });

        
        if (type === 'SYSTEM_DATA') {
            console.log(`SYSTEM_DATA found`);
            await processSystemData(filePath, jobId); // adding system records
        } else if (type === 'RECONCILIATION') {
            console.log("Reconciliation logic coming soon..."); // reconcillation
        }

        await Upload.findByIdAndUpdate(jobId, { status: 'completed' });
        console.log(`finished job: ${jobId}`);

    } catch (error) {
        console.error(`Job ${jobId} Failed:`, error.message);
        await Upload.findByIdAndUpdate(jobId, {
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