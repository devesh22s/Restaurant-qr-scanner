import User from '../models/user.js';
import Cart from '../models/cart.js';
import Coupan from '../models/coupan.js';
import Order from '../models/order.js';
import razorpay from '../config/razorpay.js';
const calculateOrderNumber = () => {
  const date = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `ORDER-${date * randomNumber}`;
};

export const createOrder = async (req, res, next) => {
  const {
    coupanCode,
    tableNumber,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    paymentMethod,
  } = req.body;
  if (!tableNumber) {
    const error = new Error('No table Found');
    error.status = 404;
    throw error;
  }
  try {
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    const cartItems = await Cart.findOne({ userId }).populate(
      'items.menuItemId'
    );
    const orderItems = [];

    for (let item of cartItems.items) {
      let subTotal = 0;
      console.log(item);
      console.log(item.quantity, item.menuItemId.price);
      const total = item.quantity * item.menuItemId.price;
      subTotal += total;

      orderItems.push({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
        subTotal,
      });
    }
    //total Cart subtotal
    let subTotal = 0;
    for (let item of orderItems) {
      subTotal += item.subTotal;
    }
    console.log(subTotal);
    //NOTE calculate discount amount and cross verfiy the coupan
    const coupan = await Coupan.findOne({ code: coupanCode, isActive: true });

    //result discountAmount ?
    const orderNumber = calculateOrderNumber();

    const dataOfOrder = {
      orderNumber,
      userId,
      sessionToken: null,
      items: orderItems,
      subTotal,
      coupanCode,
      tableNumber,
      customerEmail,
      customerName,
      paymentMethod,
      customerPhone,
      notes,
    };

    if (paymentMethod === 'cash') {
      const order = await Order.create(dataOfOrder);
      return res.status(201).json({
        message: 'Order Placed Successfully',
        data: order,
      });
    }

    if (paymentMethod === 'razorpay') {
      console.log('this is runnnnnnnnnnnnnnnning');
      const options = {
        amount: subTotal * 100,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          customerEmail,
          customerPhone,
          customerName,
        },
      };
      const razorpayOrder = await razorpay.orders.create(options);
      console.log(razorpayOrder);
      dataOfOrder.razorPayOrderId = razorpayOrder.id;
      const order = await Order.create(dataOfOrder);

      return res.json({
        order,
      razorPayOrder : {...razorpayOrder , key : process.env.RAZORPAY_API_KEY}
      });
  }

    user.totalOrders += 1;
    await user.save();
    cartItems.items = [];
    cartItems.totalCartPrice = 0;
    await cartItems.save();

    res.json({ cartItems, orderItems, coupan });
  } catch (error) {
    next(error);
  }
};

//NOTE  client => client data X cross verify

//user identity customer/guest => if customer i need a id / if guest i need session

//NOTE userid => find cart using userId :
// var => cartItem
// items: [
//   {
//     menuItemId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Menu',
//     },
//     name: {
//       type: String,
//     },
//     price: {
//       type: Number,
//     },
//     quantity: {
//       type: Number,
//     },
//     subTotal: {
//       type: Number,
//       required: true,
//     },
//   },
// ],

//coupan
//discountAmout

//gst wagera totalAmount
//tableNumber
//coupan count
//razorpay
//customer update
//clear cart

// myorder => shirt , jeans => shirt => 2 => 500
// shirt + jeans => subtotal