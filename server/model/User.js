const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  totalSpend: {
    type: Number,
  },
  totalOrders: {
    type: Number,
  },
  loyalityPoint: {
    type: Number,
  },
  refreshToken: {
    type: String,
  },
  refreshTokenExpireTime:{
    type:Date
  },
  lastlogin:{
    type: Date,
    default: Date.now()
  }
});

const mymodel = mongoose.model("User", userSchema);
module.exports = myModel;
