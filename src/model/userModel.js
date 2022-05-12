const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: { 
        type: String, 
        required: true, 
        enum: ["Mail", "Female", "Trans"] 
    },
    dateOfBirth:{
      type:Date,
      required:true,
      trim:true
    },

    battingSide:{
        type:String,
        enum:["Right","Left"]
    },

    email: {
      // valid
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    phone: {
      // valid
      type: String,
      required: true,
      trim: true,
    },

    password: {
      // minlen 8, maxlen 15 // encrypted password
      type: String,
      required: true,
      trim: true,
    },

    address: {
      shipping: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        pinCode: {
          type: Number,
          required: true,
          trim: true,
        },
      },
      billing: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        pinCode: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("e-User", userSchema);
