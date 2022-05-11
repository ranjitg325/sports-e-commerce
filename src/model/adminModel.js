const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const adminSchema = new mongoose.Schema({
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
  type:{ 
      type:String, 
      required:true, 
      enum:["owner","manager"], 
      trim:true 
    },
  email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
  phoneNumber: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
  password: { 
      type: String, 
      required: true, 
      trim: true 
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
    state:{ 
        type:String, 
        required:true, 
        trim:true 
    },
    pinCode: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  storeData:[
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
  subAdmin:[
    {
      _id:false,
      subAdminId:{ 
            
      },
      subAdminFirstName:{ 
          type:String,
          trim:true
      },
      subAdminLastName:{ 
        type:String,
        trim:true
    } 
    }
]
},{timestamps:true});

module.exports = mongoose.model('accessor',adminSchema);
