const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    roomType:{
        type: String,
    },
    // 참여자 uuid만 저장
    participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }],
    // 마지막 메시지 (문자열만 저장)
    lastMessage: {
      type: String,
      default: ""
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatingRoom", chatRoomSchema);
