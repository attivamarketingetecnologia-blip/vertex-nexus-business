const mongoose = require('mongoose');

const monitoringSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    trim: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  status_code: {
    type: Number,
    required: true
  },
  response_time: {
    type: Number, // in milliseconds
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  error_message: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
monitoringSchema.index({ endpoint: 1, timestamp: -1 });
monitoringSchema.index({ status_code: 1 });
monitoringSchema.index({ success: 1 });

const Monitoring = mongoose.model('Monitoring', monitoringSchema);

module.exports = Monitoring;