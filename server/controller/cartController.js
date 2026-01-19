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
    const { menuItemId, quantity = 1 } = req.body;
    const { type, id } = req.identity; // From middleware

    if (!id) return res.status(400).json({ message: "No User or Session identified" });

    // Find Cart based on User OR Session
    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        userId: type === 'user' ? id : null,
        sessionToken: type === 'session' ? id : null,
        items: []
      });
    }

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
    // console.log(existingMenuItemInCart);
    
    await updateTotalPrice(cart.items)
    await cart.save();

    res.status(201).json({
      message: 'Items added to cart successfully',
      data:cart
     
    });
  } catch (error) {
    console.log('Error adding to cart:', error);
   
  }
};

// get full cart 
export const getCart = async (req, res) => {
  try {
    const { type, id } = req.identity;
    if (!id) return res.json({ items: [], totalCartPrice: 0 }); // Empty cart for stranger

    let query = type === 'user' ? { userId: id } : { sessionToken: id };
    const cart = await Cart.findOne(query).populate('items.menuItemId');

    if (!cart) return res.json({ items: [], totalCartPrice: 0 });

    // Formatting response specifically for frontend
    const items = cart.items.map(item => {
        if(!item.menuItemId) return null; // If menu item deleted
        return {
            menuItemId: item.menuItemId._id,
            name: item.menuItemId.name,
            image: item.menuItemId.image,
            price: item.menuItemId.price,
            quantity: item.quantity,
            total: item.quantity * item.menuItemId.price
        }
    }).filter(i => i !== null);

    res.json({ userId: cart.userId, sessionToken: cart.sessionToken, items, totalCartPrice: cart.totalCartPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

    res.status(200).json({ message: 'Item removed from cart', data:cart });
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
      data:cart
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
      data: cart
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
      data: cart
    });
    
  } catch (error) {
        res.status(500).json({ message: error.message });
    
  }

}

