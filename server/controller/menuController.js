import cloudinary from "../config/cloudinary.js";
import Menu from "../model/menu.js";

export const createMenu = async (req, res) => {
  console.log(req.file);

  try {
    const filePath = req?.file?.path || null;
    const result = await cloudinary.uploader.upload(filePath, {folder: "menu"});
    console.log(result);
    const menuItem = await Menu.create({...req.body, image: result.secure_url})
    res.status(201).json({
        data: menuItem,
        message: "New menu item added "
    })
    res.send(JSON.stringify(result));
  } catch (error) {}
};
