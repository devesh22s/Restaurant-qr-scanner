import Cart from "../model/cart.js";
import Menu from "../model/menu.js";


export const addToCart = async (req, res) => {
  try {
    const { menuItemId, userId, quantity = 1 } = req.body;

    //step 1
    let cart = await Cart.findOne({ userId });
    
    //if cart not exist create a new cart
    if (!cart) {
      cart = new Cart({ userId, items: [], totalCartPrice: 0 });
    }

    console.log(cart)

    let menu = await Menu.findById(menuItemId);
    if (!menu) {
      res.send('no menu item found');
    }
    console.log('menu' , menu)

    const existingMenuItemInCart = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );
    
    // //existing cart => quantiy += 1  , if not existing - cart.items.push
    
    if (!existingMenuItemInCart) {
        cart.items.push({ menuItemId, quantity });
    } else {
        existingMenuItemInCart.quantity += 1;
    }
    console.log(existingMenuItemInCart);
    
    cart.totalCartPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity * menu.price;
    }, 0);
    await cart.save();

    res.status(201).json({
      message: 'Items added to cart successfully',
    });
  } catch (error) {}
};



//removeItemCart
//increase
//decrease
//clear cart