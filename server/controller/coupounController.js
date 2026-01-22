import Coupon from "../model/coupon.js";

// ==============================================
//  ADMIN CONTROLLERS
// ==============================================

// 1. Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const { 
      code, discountType, discountValue, maxDiscount, 
      minOrderAmount, validFrom, validTo, usageLimit, description, isFirstOrder 
    } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const newCoupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      maxDiscount: discountType === 'percentage' ? maxDiscount : null,
      minOrderAmount: minOrderAmount || 0,
      validFrom: validFrom || new Date(),
      validTo: validTo,
      usageLimit: usageLimit || null,
      usedCount: 0,
      isFirstOrder: isFirstOrder || false,
      description,
      isActive: true
    });

    res.status(201).json({ success: true, message: "Coupon Created", coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Coupons (For Admin Dashboard)
export const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Coupon Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================================
//  CUSTOMER CONTROLLERS (Checkout Logic)
// ==============================================

// 4. Verify/Apply Coupon
export const verifyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    // 1. Find Coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid Coupon Code" });
    }

    // 2. Check Expiry
    if (new Date() > new Date(coupon.validTo)) {
      return res.status(400).json({ success: false, message: "Coupon Expired" });
    }
    
    if (new Date() < new Date(coupon.validFrom)) {
        return res.status(400).json({ success: false, message: "Coupon not active yet" });
    }

    // 3. Check Min Order Amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order of ₹${coupon.minOrderAmount} required` 
      });
    }

    // 4. Check Usage Limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    // 5. Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, cartTotal);

    res.status(200).json({
      success: true,
      message: "Coupon Applied",
      discountAmount: Math.round(discountAmount),
      code: coupon.code
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};