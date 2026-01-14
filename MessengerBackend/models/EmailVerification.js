// models/EmailVerification.js
const mongoose = require('mongoose');

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true  // 만료된 문서 자동 삭제용
  },
  verifiedAt: Date
}, {
  timestamps: true,
  collection: 'email_verifications'
});

// TTL 인덱스 - 만료된 문서 자동 삭제 (선택사항)
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);