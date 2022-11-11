const mongoose=require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    productId :{
        required: true,
        type : ObjectId,
        ref : "product"  
    },
    reviewedBy:{
        type : ObjectId,
        required: true,
        ref : "e-User",
    },
    reviewedAt:{
        type: Date, 
        default:Date.now,
    },
    rating:{
        type:Number,
        required: true
    },
    review:{
        type: String,
    },
    isDeleted: {
        type : Boolean,
        default: false
    },
    deletedAt: {  
        type: Date,
        default:null
    },
}, {timestamps:true})
module.exports = mongoose.model('reviewProduct', reviewSchema)