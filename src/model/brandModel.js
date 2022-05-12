const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const brandSchema = new mongoose.Schema(
  {
    adminId: {
      type: ObjectId,
      required: true,
      ref: "store",
      trim: true,
    },
    storeId:{
      type:ObjectId,
      required:true,
      ref:"brand",
      trim:true
    },
    // brandLogo: { 
    //     type: String, 
    //     required: true, 
    //     trim: true 
    //   },
    brandName: { 
        type: String, 
        required: true,
        unique:true, 
        trim: true 
      },
    brandType: {
       type: String,
       required: true,
       enum: ["equipments", "clothings", "accessories"],
      },
    deletedAt: { 
        type: Date, 
        default: null 
      },
    isDeleted: { 
        type: Boolean, 
        default: false 
      },
  },
  { timestamps:true}
);

module.exports = mongoose.model("brand", brandSchema);
