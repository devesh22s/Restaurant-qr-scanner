import Cart from "../model/cart.js";
import Menu from "../model/menu.js";
import Session from "../model/Session.js"; // ✅ Import Session Model
import { SuccessResponse, ErrorResponse } from "../utils/responseWrapper.js";

// === HELPER 1: Calculate Total Price ===
const calculateTotal = async (items) => {
    let total = 0;
    for (const item of items) {
        const menu = await Menu.findById(item.menuItemId);
        if (menu) {
            total += item.quantity * menu.price;
        }
    }
    return total;
};

// === HELPER 2: Standardize Response ===
const getCartData = async (cart) => {
    await cart.populate('items.menuItemId');

    const cleanItems = cart.items
        .filter(item => item.menuItemId) 
        .map(item => ({
            menuItemId: item.menuItemId._id,
            name: item.menuItemId.name,
            image: item.menuItemId.image,
            price: item.menuItemId.price,
            description: item.menuItemId.description,
            quantity: item.quantity,
            total: item.quantity * item.menuItemId.price
        }));

    return {
        _id: cart._id,
        userId: cart.userId,
        sessionToken: cart.sessionToken,
        items: cleanItems,
        totalCartPrice: cart.totalCartPrice
    };
};

// ===================== ADD TO CART (Fixed for Guest) =====================
export const addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;
    
    // Middleware se identity aayi
    const { type, id } = req.identity;

    if (!id) return ErrorResponse(res, 400, "Session invalid. Please refresh.");

    // ✅ FIX: Agar Guest hai, aur DB me Session nahi hai, to Create karo
    if (type === 'session') {
        const existingSession = await Session.findOne({ sessionToken: id });
        if (!existingSession) {
            await Session.create({
                sessionToken: id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Days
            });
        }
    }

    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        userId: type === 'user' ? id : null,
        sessionToken: type === 'session' ? id : null,
        items: []
      });
    }

    const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);
    
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.items.push({ menuItemId, quantity: parseInt(quantity) });
    }

    cart.totalCartPrice = await calculateTotal(cart.items);
    await cart.save();

    const responseData = await getCartData(cart);
    return SuccessResponse(res, 200, responseData, "Item added to cart");
  } catch (error) {
    next(error);
  }
};

// ===================== GET CART =====================
export const getCart = async (req, res, next) => {
  try {
    const { type, id } = req.identity;
    
    if (!id) return SuccessResponse(res, 200, { items: [], totalCartPrice: 0 });

    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query);

    if (!cart) return SuccessResponse(res, 200, { items: [], totalCartPrice: 0 });

    const responseData = await getCartData(cart);
    return SuccessResponse(res, 200, responseData);

  } catch (error) {
    next(error);
  }
};

// ===================== REMOVE ITEM =====================
export const removeItemCart = async (req, res, next) => {
  try {
    const { menuItemId } = req.body; 
    const { type, id } = req.identity;

    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    let cart = await Cart.findOne(query);

    if (!cart) return ErrorResponse(res, 404, "Cart not found");

    cart.items = cart.items.filter(item => item.menuItemId.toString() !== menuItemId);
    cart.totalCartPrice = await calculateTotal(cart.items);
    await cart.save();

    const responseData = await getCartData(cart);
    return SuccessResponse(res, 200, responseData, "Item removed");
  } catch (error) {
    next(error);
  }
};

// ===================== INCREASE ITEM =====================
export const increaseItem = async (req, res, next) => {
    try {
        const { menuItemId } = req.body;
        const { type, id } = req.identity;
        let query = type === 'user' ? { userId: id } : { sessionToken: id };
        let cart = await Cart.findOne(query);

        if(!cart) return ErrorResponse(res, 404, "Cart not found");

        const item = cart.items.find(i => i.menuItemId.toString() === menuItemId);
        if(item) item.quantity += 1;

        cart.totalCartPrice = await calculateTotal(cart.items);
        await cart.save();

        const responseData = await getCartData(cart);
        return SuccessResponse(res, 200, responseData, "Increased");
    } catch (error) { next(error); }
};

// ===================== DECREASE ITEM =====================
export const decreaseItem = async (req, res, next) => {
    try {
        const { menuItemId } = req.body;
        const { type, id } = req.identity;
        let query = type === 'user' ? { userId: id } : { sessionToken: id };
        let cart = await Cart.findOne(query);

        if(!cart) return ErrorResponse(res, 404, "Cart not found");

        const itemIndex = cart.items.findIndex(i => i.menuItemId.toString() === menuItemId);
        
        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }
        }

        cart.totalCartPrice = await calculateTotal(cart.items);
        await cart.save();

        const responseData = await getCartData(cart);
        return SuccessResponse(res, 200, responseData, "Decreased");
    } catch (error) { next(error); }
};