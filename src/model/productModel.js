const mongoose=require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    
    brandName:{
        type:String,
        required:true,
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

    // productImage: { // s3 link
    //     type: String,
    //     required: true,
    //     trim: true
    // },

    style: {
        type: String,
        trim: true
    },

    productType: [{ //at least one type
        type: String,
        trim: true,
        enum: ["equipments","clothings","accessories"]
    }],

    installments: {
        type: Number,
        trim: true
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