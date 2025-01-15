const mongoose = require("mongoose");
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 5,
    }
  },
  {
    timestamps: true,
  }
);
const ForgotPassword = mongoose.model( "ForgotPassword",forgotPasswordSchema,"forgot-password" // tên dtb ở mongodb
);
module.exports = ForgotPassword;
