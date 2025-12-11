import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  price:{
    type: Number
  },
  category:{
    type: String
  }
});

const Menu = mongoose.model("menu", menuSchema);

export default Menu;
