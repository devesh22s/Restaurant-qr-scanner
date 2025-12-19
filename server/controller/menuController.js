import cloudinary from "../config/cloudinary.js";
import Menu from "../model/menu.js";

export const createMenu = async (req, res) => {
  // how can i access the image path here
  console.log(req.file);

  try {
    const filePath = req?.file?.path || null;
    console.log(filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu',
    });
    console.log(result);
    const menuItem = await Menu.create({
      ...req.body,
      image: result.secure_url,
    });
    res.status(201).json({
      data: menuItem,
      message: 'New menu item addedd',
    });
  } catch (error) {}
};


//  get menu items with category

export const getmenuCategory = async(req, res)=>{
  try {
    const {category} = req.query;
    console.log("Fetching menu items, category:", category);

    const filter = { isAvailable: true };
    if (category) {
      filter.category = category;
    }
    
      const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });

    
    
    return res.status(200).json({
      success: true,
      data: menuItems,
      count: menuItems.length
    })
    
  } catch (error) {
    console.log("Error fetching menu items:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch menu items"
    });
  }

}



// update menu items 

export const updateMenu = async(req, res)=>{
  try {
    const {id} = req.params
    let mydata = {...req.body}
   

    // if image is provided then upload new image to cloudinary
    if(req.file){

      const filePath = req?.file?.path || null;
    const result = await cloudinary.uploader.upload(filePath, {folder: "menu"});
    mydata.image = result.secure_url

    }
    const menuUpdate = await Menu.findByIdAndUpdate(id, mydata, {new: true})
    if(!menuUpdate){
      res.status(400).json({message: "Menu item not found"})
    }
    res.status(200).json({messsage: "Menu updated successfully"})

  } catch (error) {
    res.status(500).json({message: error.message})
    
  }
}



// delete menu
export const deleteMenu = async(req, res)=>{
  try {
    const {id} = req.params
   

   
    const deletemenu = await Menu.findByIdAndDelete(id)
    if(!deletemenu){
      res.status(400).json({message: "Menu item not found"})
    }
    res.status(200).json({messsage: "Menu delted successfully"})

  } catch (error) {
    res.status(500).json({message: error.message})
    
  }
}