const AuditLog = require("../models/AuditLog");

const logAudit = async ({ req, action, collection, oldValue, newValue, docId, notes }) => {
    try {
        await AuditLog.create({
            user: req?.user?._id || null,
            action,
            collectionName: collection,
            oldValue,
            newValue,
            documentId: docId,
            notes
        });

    } catch (error) {
        console.error('Audit failed :', error.message);
    }
};

module.exports = { logAudit };