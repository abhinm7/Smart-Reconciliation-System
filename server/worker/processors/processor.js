const fs = require('fs');
const csv = require('csv-parser');
const Upload = require('../../models/Upload');
const Record = require('../../models/Record');

const processSystemData = async (filePath, jobId) => {
    try {
        const total = await countLines(filePath);
        console.log(`Total records detected: ${total}`);

        await Upload.findByIdAndUpdate(jobId, { totalRecords: total });
        return new Promise((resolve, reject) => {
            const results = [];
            let count = 0;
            const batch_length = 1000;

            const stream = fs.createReadStream(filePath).pipe(csv()).on('data', (data) => {

                // handle duplicates by updates existing records and inserts new ones
                results.push({
                    updateOne: {
                        filter: { transactionId: data.TransactionID },
                        update: {
                            $set: {
                                transactionId: data.TransactionID,
                                referenceNumber: data.ReferenceNumber,
                                amount: parseFloat(data.Amount),
                                date: new Date(data.Date),
                                description: data.Description,
                                sourceJob: jobId
                            }
                        },
                        upsert: true
                    }
                });

                count++; //processed record count

                if (results.length >= batch_length) {
                    stream.pause();

                    Record.bulkWrite(results).then(() => {
                        results.length = 0;
                        return Upload.findByIdAndUpdate(jobId, { processedRecords: count }).exec();
                    }).then(() => {
                        console.log('current processed records ::', count)
                        stream.resume();
                    }).catch(err => stream.destroy(err));

                }
            }).on('end', async () => {
                // process leftovers
                if (results.length > 0) {
                    await Record.bulkWrite(results);
                }
                resolve(count);
            }).on('error', (err) => {
                reject(err);
            })
        })
    } catch (error) {
        throw error;
    }
};

const countLines = (filePath) => {
    return new Promise((resolve, reject) => {
        let lines = 0;
        fs.createReadStream(filePath)
            .on('data', (chunk) => {
                for (let i = 0; i < chunk.length; ++i) {
                    if (chunk[i] === 10) lines++;
                }
            })
            .on('end', () => resolve(lines-1))
            .on('error', reject);
    });
};

module.exports = { processSystemData };