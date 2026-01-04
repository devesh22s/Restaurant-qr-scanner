import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  contact: {
    type: Number,
  },
  accountTypes : {
    type : String ,
    enum : ['REGISTERED' , 'GUEST'],
    default : "REGISTERED"
  },

  isActive: {
    type: Boolean,
  },

  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },

  totalSpend: {
    type: Number,
  },

  totalOrders: {
    type: Number,
  },

  loyalityPoint: {
    type: Number,
    default: 0,
  },

  refreshToken: {
    type: String,
  },

  refreshTokenExpireTime: {
    type: Date
  },

  lastlogin: {
    type: Date,
    default: null,
  },
});

const myModel = mongoose.models.User || mongoose.model("User", userSchema);
export default myModel;
