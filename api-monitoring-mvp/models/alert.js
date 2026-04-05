const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    trim: true
  },
  alert_type: {
    type: String,
    required: true,
    enum: ['timeout', 'error', 'slow_response', 'status_code', 'unavailable']
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'warning'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolved_at: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ endpoint: 1, resolved: 1 });
alertSchema.index({ created_at: -1 });
alertSchema.index({ severity: 1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;