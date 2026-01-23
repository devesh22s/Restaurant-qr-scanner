import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true }, // Ensure unique & uppercase
  discountType: {
    type: String,
    enum: ["percentage", "fixedAmount"],
    required: true,
  },
  discountValue: { type: Number, required: true }, // Value is mandatory
  maxDiscount: { type: Number, default: null }, // Nullable

  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },

  minOrderAmount: { type: Number, default: 0 }, // ✅ Default 0 to prevent undefined error

  isActive: { type: Boolean, default: true },
  isFirstOrder: { type: Boolean, default: false }, // Boolean default false

  usageLimit: { type: Number, default: null }, // Null means unlimited
  usedCount: { type: Number, default: 0 }, // Start with 0

  description: { type: String },
});

const Coupon = mongoose.model("Coupon", couponSchema); // Fixed typo 'Coupoun' -> 'Coupon'
export default Coupon;
