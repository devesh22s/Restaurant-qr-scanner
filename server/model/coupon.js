import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
  },

  discountType: {
    type: String,
    enum: ["percentage", "fixedAmount"],   ////dropdown percentage , fixed amount  20% Rs50
  },

  maxDiscount: {
    type: Number,

  },
  validFrom: {
    type: Date,
  },
  validTo: {
    type: Date,
  },

  minorderAmount: {
    type: Number, //1000
  }, // cart fetch -> minOrderAmount > 1000 then only coupouns are availabel,

  isActive: {
    type: Boolean,
    default: true,
  },

  isFirstOrder: {
    type: Boolean,
    default : null
  }, //users => totalOrders =>

  usageLimit: {
    type: Number,
  },

  usedCount: {
    type: Number,
  },
  discountValue: {
    type: Number,
  },

  description: {
    type: String,
  },
});


const Coupon = mongoose.model("Coupoun", couponSchema);

export default Coupon;