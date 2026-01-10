const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true
    },

    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("ChatMessage", chatMessageSchema);
