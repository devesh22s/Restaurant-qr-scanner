

import Coupon from "../model/coupon.js";

export const getAllCoupouns = async (req, res) => {
  try {
    const coupons = await Coupon.find()

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message
    });
  }
};


export const registrationCoupoun = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minorderAmount,
      validFrom,
      validTo,
      usageLimit,
      description
    } = req.body;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists"
      });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      maxDiscount,
      minorderAmount,
      validFrom,
      validTo,
      usageLimit,
      description,
      isFirstOrder: true,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: "Registration coupon created successfully",
      data: coupon
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create registration coupon",
      error: error.message
    });
  }
};
