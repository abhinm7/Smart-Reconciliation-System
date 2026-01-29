const fs = require('fs');

const countLines = (filePath) => {
    return new Promise((resolve, reject) => {
        let lines = 0;
        fs.createReadStream(filePath)
            .on('data', (chunk) => {
                for (let i = 0; i < chunk.length; ++i) {
                    if (chunk[i] === 10) lines++;
                }
            })
            .on('end', () => resolve(lines - 1))
            .on('error', reject);
    });
};

module.exports = { countLines };