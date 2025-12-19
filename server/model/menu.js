import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
  }, // ui se aayega
  description:{
    type: String
  }, // ui se aayega
  image: {
    type: String,
  },  // ui se in binary -> parse -> cloudinary par save
  isAvailable:{
    type: Boolean,
    default: true
  },  // ui
  price:{
    type: Number
  }, //ui
  category:{
    type: String
  }  //ui
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
