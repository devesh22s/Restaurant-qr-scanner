import cloudinary from "../config/cloudinary.js"; // Ensure extension .js
import Menu from "../model/menu.js";

// CREATE MENU
export const createMenu = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let imageUrl = "";

    // ✅ FIX: Check if file exists before uploading
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'menu',
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Error:", uploadError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const menuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image: imageUrl, // Saved URL
      isAvailable: true
    });

    res.status(201).json({
      success: true, // Frontend check: if(res.data.success)
      data: menuItem,
      message: 'New menu item added',
    });

  } catch (error) {
    console.error("Create Menu Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MENU (Admin needs ALL items, Customer needs AVAILABLE items)
export const getmenuCategory = async (req, res) => {
  try {
    const { category, isAdmin } = req.query; 

    // ✅ FIX: Default filter empty rakho (Admin sab dekh sake)
    // Agar customer ke liye strict karna hai, to frontend se alag query bhejo ya middleware use karo
    let filter = {}; 

    // Agar frontend se specific category maangi hai
    if (category && category !== "All") {
      filter.category = category;
    }
    
    // Optional: Agar aap chahte hain ki bina login wale sirf available dekhein:
    // filter.isAvailable = true; 
    // LEKIN Admin Panel ke liye hume saare items chahiye, isliye abhi hata diya hai.

    const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });

  } catch (error) {
    console.error("Error fetching menu:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch menu items"
    });
  }
};

// UPDATE MENU
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    let mydata = { ...req.body };

    // If new image is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "menu" });
      mydata.image = result.secure_url;
    }

    const menuUpdate = await Menu.findByIdAndUpdate(id, mydata, { new: true });

    if (!menuUpdate) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, message: "Menu updated successfully", data: menuUpdate });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE MENU
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletemenu = await Menu.findByIdAndDelete(id);

    if (!deletemenu) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    
    res.status(200).json({ success: true, message: "Menu deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};