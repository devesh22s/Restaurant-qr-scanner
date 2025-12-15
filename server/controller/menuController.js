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
  } catch (error) {
     return res.status(500).json({
      message: error.message
     })
  }
};


//  get menu items with category

export const getmenuCategory = async(req, res)=>{
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