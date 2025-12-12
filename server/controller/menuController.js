import cloudinary from "../config/cloudinary.js";
import Menu from "../model/menu.js";

export const createMenu = async (req, res, next) => {
  // console.log(req.file);

  try {
    const filePath = req?.file?.path || null;
    const result = await cloudinary.uploader.upload(filePath, {folder: "menu"});

    console.log("the result is  => ", result);
    const menuItem = await Menu.create({...req.body, image: result.secure_url})
    res.status(201).json({
        data: menuItem,
        message: "New menu item added"
    })
    res.send(JSON.stringify(result));
  } catch (error) {
    console.log(error);
  }
};


//  get menu items

export const menuCategory = async(req, res)=>{
  try {
    const {category} = req.query;
    console.log(req.query);

    const filter = category ? {category, isAvailabel: true} :{isAvailabel: true}
    const menuItems = await Menu.find(filter)
    console.log(menuItems);
    
    return res.status(200).json({
      success: true,
      data: menuItems
    })
    
  } catch (error) {
    console.log(error);
    
    
  }

}
