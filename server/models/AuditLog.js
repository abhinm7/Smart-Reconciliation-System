const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  action: { type: String, required: true },
  collectionName: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId },

  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },

  source: { type: String, default: 'WEB_APP' },
  ipAddress: { type: String },
  userAgent: { type: String },
  notes: { type: String }

}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);