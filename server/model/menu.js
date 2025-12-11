import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
  }, // ui se aayega
  descripition:{
    type: String
  }, // ui se aayega
  image: {
    type: String,
  },  // ui se in binary -> parse -> cloudinary par save
  isAvailabel:{
    type: String,
    default: true
  },  // ui
  price:{
    type: Number
  }, //ui
  category:{
    type: String
  }  //ui
});

const Menu = mongoose.model("menu", menuSchema);

export default Menu;
