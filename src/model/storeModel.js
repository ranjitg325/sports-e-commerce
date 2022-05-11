const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const venderSchema = new mongoose.Schema(
  {
    
    venderName: { 
          type: String, 
          required: true, 
          trim: true 
      },
    venderImage: { 
          type: String, 
          required: true, 
          trim: true 
      },
    
    accessor:[
          {
                _id:false,    
                accessorId:{ 
                      type:ObjectId, 
                      ref:'accessor', 
                      trim:true 
                  },
                accessorType:{ 
                      type:String, 
                      trim:true 
                  }
          }
    ],
    subAccessor:[
      {
        _id:false,
      subAccessorId:{
          type:ObjectId,
          ref:'subAccessor',
          trim:true
      },
        subAccessorName:{
           type:String,
           trim:true
      }
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
      pincode: {
        type: Number,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.Model("store", venderSchema);
