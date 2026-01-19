
import Cart from "../model/cart.js";
import Coupon from "../model/coupon.js";
import myModel from "../model/User.js";

export const getAllCoupouns = async (req, res) => {
  try {
    const {cartTotal} = req.query
    const userId = req.user.id

    const user = await myModel.findById(userId);
    console.log('fetched from database', user);

// user cart fetch -> totalcartprice
const cart = await Cart.findOne({userId})
let totalcartprice;
if(cart){
  totalcartprice = cart.totalCartPrice
}

//how to fetch all coupans than apply map method ;
    const allCoupans = await Coupon.find();
    console.log(allCoupans);

// const AvailabelCoupouns = allcoupouns.filter((coupoun)=>{
//   return totalcartprice > coupons.minorderAmount &&  new Date() > coupons.validFrom && new Date() < coupons.validTo
// })

const CoupansAfterCalculation = allCoupans.map((coupans) => {
      //calculate isAvailable flag
      const isCartPriceMeetsMinOrderAmount =
        totalcartprice > coupans.minorderAmount;
      const isCoupanIsValid =
        new Date() > coupans.validFrom && new Date() < coupans.validTo;
      const isUserFirstTime = user.totalOrders === 0;
      const isCoupanIsForFirstOrder = coupans.isFirstOrder;
      console.log(coupans.code, isCartPriceMeetsMinOrderAmount);

      const isAvailable =
        isCartPriceMeetsMinOrderAmount &&
        isCoupanIsValid &&
        (isCoupanIsForFirstOrder ? isUserFirstTime : true);

      let discountAmount;
      if (coupans.discountType) {
        if (coupans.discountType === 'fixedAmount') {
          discountAmount = totalcartprice - coupans.discountValue;
        }
        if (coupans.discountType === 'percentage') {
          discountAmount = (totalcartprice * coupans.discountValue) / 100;
        }
        if (coupans.maxDiscount && discountAmount > coupans.maxDiscount) {
          discountAmount = coupans.maxDiscount;
        }
      }
      return {
        _id: coupans._id,

        finalAmount: totalcartprice - discountAmount,
        code: coupans.code,
        discountType: coupans.discountType,
        description: coupans.description,
        discountAmount,
        isFirstOrder: coupans.isFirstOrder,
        minOrderAmount: coupans.minOrderAmount,
        validFrom: coupans.validFrom,
        validTo: coupans.validTo,
        isAvailable,
        isCartPriceMeetsMinOrderAmount,
        totalcartprice,
      };
    });
    //  500 * 10 / 100 => 50
    //1000 * 10 / 100 => 100   maxDiscount = 150
    //2000 * 10 / 200 > maxDiscount = 150
    // disocuntValue = maxDiscount;
    res.json({
      CoupansAfterCalculation,
    });
  } catch (error) {}
};



export const registerCoupan = async (req, res) => {
  try {
    const {
      code,
      discountType,
      maxDiscount,
      validFrom,
      validTo,
      usageLimit,
      minOrderAmount,
      description,
    } = req.body;

    if (!code || !discountType) {
      return res
        .status(400)
        .json({ message: 'Code and discountType are required' });
    }

    const existingCoupan = await Coupan.findOne({ code: code.toUpperCase() });
    if (existingCoupan) {
      return res.status(400).json({ message: 'Coupan code already exists' });
    }

    const coupanData = {
      code: code.toUpperCase(),
      discountType,
      maxDiscount: maxDiscount || null,
      validFrom: validFrom || new Date(),
      validTo: validTo || null,

      usageLimit: usageLimit || null,
      minOrderAmount: minOrderAmount || 0,

      description: description || '',
      isActive: true,
      usedCount: 0,
    };

    const savedCoupan = await new Coupan(coupanData).save();

    res.status(201).json({
      message: 'Coupan created successfully',
      coupan: savedCoupan,
    });
  } catch (error) {
    console.error('Error registering coupan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




//NOTE js? data type=> primitiv and non primitve 
// memory allocation  , dynamically type language  statically typed languages
//client js and server js kya difference ?
//type coersion and conversion ? Number('5')
//truthy and falsy values ? falsy => null , undefined , '' , NaN , -0 , 0 ,false

// null && 0 
// false && false
// null
