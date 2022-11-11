const mongoose=require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    
    brand:{
        type:String,
        required:true,
        enum:['Nike','Adidas','Puma','Reebok','Asics','Under Armour','Other'],
        trim:true
    },

    productName:{
        type:String,
        required:true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    category : {
        type: String,
        trim: true
    },
    subcategory: [String],
    price: { // valid number decimal
        type: Number,
        required: true,
        trim: true
    },

    currencyId: { //INR
        type: String,
        required: true,
        trim: true
    },

    currencyFormat: { //Rupee symbol
        type: String,
        required: true,
        trim: true
    },

    isFreeShipping: {
        type: Boolean,
        default: false
    },

    images: {  //product images
        type: Array,
        required: true,
        trim: true
    },

    productType: [{ //at least one type
        type: String,
        trim: true,
        enum: ["equipments","clothings","accessories"]
    }],

    quantity: { 
        type: Number,
        trim: true,
        default:0
    },

    deletedAt: {  // when the document is deleted
        type: Date,
        default:null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
},{timestamps:true})


module.exports = mongoose.model('product',productSchema);