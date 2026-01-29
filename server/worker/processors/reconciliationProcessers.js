const fs = require('fs');
const csv = require('csv-parser');
const Upload = require('../../models/Upload');
const Record = require('../../models/Record');
const ReconciliationResult = require('../../models/ReconciliationResult');
const { countLines } = require('./utils');

const MATCHING_RULES = {
    variancePercentage: 2.0, 
};

const processReconciliation = async (filePath, jobId) => {
    try {
        const total = await countLines(filePath);
        console.log(`Total records detected: ${total}`);

        await Upload.findByIdAndUpdate(jobId, { totalRecords: total });

        return new Promise((resolve, reject) => {
            let batch = [];
            let count = 0;
            const batch_length = 1000;
            const seenIds = new Set();

            const stream = fs.createReadStream(filePath).pipe(csv())
                .on('data', (data) => {
                    const rowId = data.TransactionID;

                    // save duplicates immediately
                    if (seenIds.has(rowId)) {
                        count++;
                        saveSingleResult({
                            jobId,
                            uploadedTransactionId: rowId,
                            uploadedAmount: parseFloat(data.Amount),
                            status: 'DUPLICATE',
                            notes: 'Duplicate ID found within uploaded file'
                        });
                        return;
                    }
                    seenIds.add(rowId);

                    batch.push({
                        id: data.TransactionID,
                        amount: parseFloat(data.Amount),
                        ref: data.ReferenceNumber
                    });

                    if (batch.length >= batch_length) {
                        stream.pause();
                        processBatch(batch, jobId).then(() => {
                            count += batch.length;
                            Upload.findByIdAndUpdate(jobId, { processedRecords: count }).exec();
                            batch = [];
                            console.log("current status :", count);
                            stream.resume();
                        }).catch(err => {
                            stream.destroy(err)
                        });
                    }
                })
                .on('end', async () => {
                    if (batch.length > 0) {
                        await processBatch(batch, jobId);
                        count += batch.length;
                    }
                    console.log(`Reconciliation Complete. Processed ${count} rows.`);
                    resolve(count);
                })
                .on('error', (error) => {
                    reject(error);
                })
        })
    }
    catch (error) {
        throw error
    }
}

const processBatch = async (csvRows, jobId) => {
    const ids = csvRows.map(row => row.id);
    const refs = csvRows.map(row => row.ref).filter(r => r);

    // find all matching ids
    const systemRecords = await Record.find({
        $or: [
            { transactionId: { $in: ids } },
            { referenceNumber: { $in: refs } }
        ]
    });

    // use a map for faster lookup from db array
    const idMap = new Map();
    const refMap = new Map();

    systemRecords.forEach(rec => {
        idMap.set(rec.transactionId, rec);
        if (rec.referenceNumber) refMap.set(rec.referenceNumber, rec);
    });

    const resultToSave = csvRows.map(row => {
        let status = 'UNMATCHED';
        let variance = 0;
        let systemRecordId = null;
        let systemAmount = null;
        let notes = '';

        const recById = idMap.get(row.id);
        const recByRef = row.ref ? refMap.get(row.ref) : null;

        // finding exact match
        if (recById) {
            systemAmount = recById.amount;
            systemRecordId = recById._id;
            variance = row.amount - systemAmount;

            if (Math.abs(variance) === 0) {
                status = 'MATCHED';
            } else {
                status = 'UNMATCHED';
                notes = 'Transaction ID matched but amount different';
            }
        }
        // finding partial match
        else if (recByRef) {
            const diff = Math.abs(row.amount - recByRef.amount);
            const allowed_variance = (recByRef.amount * MATCHING_RULES.variancePercentage) / 100;

            if (diff <= allowed_variance) {
                status = 'PARTIAL_MATCH';
                systemAmount = recByRef.amount;
                systemRecordId = recByRef._id;
                variance = row.amount - recByRef.amount;
                notes = `Matched via Reference Number (Variance: ${((diff / recByRef.amount) * 100).toFixed(2)}%)`;
            } else {
                status = 'UNMATCHED';
                notes = 'Reference found, but amount variance exceeded limit';
            }
        }
        return {
            jobId,
            uploadedTransactionId: row.id,
            uploadedAmount: row.amount,
            systemRecordId,
            systemAmount,
            status,
            variance,
            notes
        };
    });
    await ReconciliationResult.insertMany(resultToSave);

}

async function saveSingleResult(data) {
    await ReconciliationResult.create(data);
}

module.exports = { processReconciliation };