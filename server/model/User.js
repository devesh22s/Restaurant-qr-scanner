const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash:{
        type: String,
        required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    }, 
    refreshToken:{

    }

  }
);

const mymodel = mongoose.model("User", userSchema);
module.exports = myModel