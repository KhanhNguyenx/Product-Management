const mongoose = require("mongoose");
const generateHelper = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generateHelper.generateRandomString(30),
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    acceptFriends: Array, //lời mời gửi đi
    requestFriends: Array, //lời mời nhận được
    friendsList: [ //danh sách bạn bè
      {
        user_id: String,
        room_chat_id: String
      }
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
