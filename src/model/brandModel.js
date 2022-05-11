const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const brandSchema = new mongoose.Schema(
  {
    manufacturersId: {
      type: ObjectId,
      required: true,
      ref: "vender",
      trim: true,
    },
    brandLogo: { 
        type: String, 
        required: true, 
        trim: true 
      },
    brandName: { 
        type: String, 
        required: true, 
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
  { timestamps }
);

module.exports = mongoose.model("brand", brandSchema);
