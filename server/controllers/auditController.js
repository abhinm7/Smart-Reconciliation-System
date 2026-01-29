const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const logs = await AuditLog.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments();

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecordHistory = async (req, res) => {
  try {
    const { docId } = req.params;

    const logs = await AuditLog.find({ documentId: docId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuditLogs, getRecordHistory };