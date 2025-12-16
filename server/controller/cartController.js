import Cart from "../model/cart.js";
import Menu from "../model/menu.js";


//  function to update totalCartPrice
const updateTotalPrice = async (cart) => {
  let total = 0;

  for (const item of cart.items) {
    const menu = await Menu.findById(item.menuItemId);
    if (menu) {
      total += item.quantity * menu.price;
    }
  }

  cart.totalCartPrice = total;
};

// add to cart
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
      return res.send('no menu item found');
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


// Remove item from cart
export const removeItemCart = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await updateTotalPrice(cart);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// increase item
export const increaseItem = async(req, res)=>{
  try {
      const {userId, menuItemId} = req.query;
    let cart = await Cart.findOne({ userId });
        let menu = await Menu.findById(menuItemId);

     if (!cart) {
      return res.status(400).json({
      message: "there is no cart",
      
    });
    }
    const item = cart.items.find((item)=> item.menuItemId.equals(menuItemId))
    item.quantity = item.quantity + 1;
    console.log(item);
  
    await updateTotalPrice(cart)
    await cart.save();
    

    res.status(200).json({
      message: "Item quantity increased",
      cart
    });
    
  } catch (error) {
        res.status(500).json({ message: error.message });
 
  }

}

// decrease item
export const decreaseItem = async(req, res)=>{
  try {
      const {userId, menuItemId} = req.query;
      console.log("comes from req.query => ",req.query);
      
    let cart = await Cart.findOne({ userId });
        let menu = await Menu.findById(menuItemId);
    const item = cart.items.find((item)=> item.menuItemId.equals(menuItemId))

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter((i) => i.menuItemId != menuItemId );
    }
    console.log(item);


  await updateTotalPrice(cart)
    await cart.save();
    

    res.status(200).json({
      message: "Item quantity decreased",
      cart
    });
    
  } catch (error) {
        res.status(500).json({ message: error.message });
 
  }

}


//  clear cart 
export const clearCart = async(req, res)=>{
  try {
      const {userId} = req.body;
    let cart = await Cart.findOne({ userId });

     if (!cart) {
      return res.status(400).json({
      message: "there is no cart",
      
    });
    }
    cart.items = []
    cart.totalCartPrice =0;
  
    await cart.save();
    

    res.status(200).json({
      message: "Cart Cleared",
      cart
    });
    
  } catch (error) {
        res.status(500).json({ message: error.message });
 
  }

}

