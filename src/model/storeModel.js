const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const venderSchema = new mongoose.Schema(
  {
    adminId:{
      type:ObjectId,
      ref:"accessor",
      trim:true
    },
    storeName: { 
          type: String, 
          required: true, 
          trim: true 
      },
    // venderImage: { 
    //       type: String, 
    //       required: true, 
    //       trim: true 
    //   },
    storeSize: { 
      type: String, 
      required: true, 
      trim: true 
  },
  storeCapacity: { 
    type: String, 
    required: true, 
    trim: true 
  },
   
    subAccessor:[
      {
        type:ObjectId,
        ref:'subAccessor',
        trim:true
      }  
    ],
   
    deletedAt: { 
          type: Date, 
          default: null 
      },
    isDeleted: { 
          type: Boolean, 
          default: false 
      },
    address: {
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
      state: { 
            type: String, 
            required: true, 
            trim: true 
      },
      pinCode: {
        type: Number,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("store", venderSchema);
