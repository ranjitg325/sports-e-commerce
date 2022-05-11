const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const subAdminSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    mobileNumber:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        street:{
            type:String,
            trim:true
        },
        city:{
            type:String,
            trim:true
        },
        pinCode:{
            type:String,
            trim:true
        }
    },
    isDeleted: { 
        type: Boolean, 
        default: false
    },
    storeAccess:[
        {
          _id:false,
          storeId:{ 
                type:ObjectId, 
                ref:'vender', 
                trim:true 
          },
          storName:{ 
              type:String,
              trim:true
          } 
        }
    ],
},{timestamps:true});

module.exports = mongoose.model('aubAccessor',subAdminSchema);