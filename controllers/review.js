const reviewModel = require("../model/review");
const productModel = require("../model/product")
const customerModel = require("../model/customer");
const userModel = require("../model/user");

exports.reviewCreate = async function (req, res) {
try{
    const data = req.body;
    let productId = req.body.productId

    const userId = req._id;
    const userData = await userModel.findOne({ userId: userId });
    if (!userData) {
      return res.status(400).send({ message: "You are not authorized" });
    }

    let product = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!product) {
        return res.status(400).send({ status: false, msg: "product not exists" })
    }
    let rating = req.body.rating
    if (!rating)
        return res.status(400).send({ status: false, msg: " please give rating" })
        if(!(data.rating>0 && data.rating<=5)) return res.status(400).send({ status: false, msg: "rating should be in between 1 to 5" })
            
    let savedReview = await reviewModel.create(data)

    return res.status(201).send({ status: true, msg: savedReview });
}
catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
}



exports.reviewUpdate = async function (req, res) {
    try {
        let data = req.body;
        let productId = req.body.productId;

        const userId = req._id;
        const userData = await userModel.findOne({ userId: userId });
        if (!userData) {
          return res.status(400).send({ message: "You are not authorized" });
        }

        if (!productId) {
            return res.status(400).send({ status: false, msg: `${productId} is not a valid productId ` })
        }

        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, msg: "product  not found" })
        }

        let reviewId = req.body.reviewId;
        if (!reviewId) {
            return res.status(400).send({ status: false, msg: `${reviewId} is not a valid review id` })
        }

        let reviewExit = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExit) {
            return res.status(404).send({ status: false, msg: "review  not exists" })
        }
        data['reviewData'] = reviewExit

        if(!(data.rating>0 && data.rating<=5))
        return res.status(400).send({ status: false, msg: "rating is not valid" })
          

       let savedData = await reviewModel.findOneAndUpdate({ _id: reviewId }, data,{ updatedAt:new Date(),new: true })
       return res.status(200).send({ status: true, msg: savedData });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}


exports.reviewDelete = async function (req, res) {
    try {

        let productId = req.body.productId;
        let reviewId = req.body.reviewId;

        const userId = req._id;
        const userData = await userModel.findOne({ userId: userId });
        if (!userData) {
          return res.status(400).send({ message: "You are not authorized" });
        }

        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, msg: "product  not found" })
        }

        let review = await reviewModel.findOne({ _id: reviewId, productId: productId ,isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, msg: "Review  not found" })
        }
        let deletedreview = await reviewModel.findOneAndUpdate({ _id: reviewId },
            {$set: { isDeleted: true, deletedAt: new Date() }},{new:true});
 
            //product.reviews=product.reviews ===0? 0:product.reviews - 1
             //await product.save()
         return res.status(200).send({ status: true, msg: 'success', data: deletedreview });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

exports.review_Get_For_Specific_Product= async function (req, res) {
    try {
        let productId = req.body.productId
        let reviewSearch = await reviewModel.find({ productId: productId ,isDeleted: false })
        if (!reviewSearch) {
            return res.status(400).send({ status: false, msg: "product or review not exists" })
        }
         return res.status(200).send({status: true, message: 'searched Product reviews', data:reviewSearch});
        }
    
    catch (err) {
        return res.status(500).send(err.message);
      }
}



exports.review_Get_By_Their_Ratings = async function (req, res) {
    try {
        const rating = req.body.rating;

          if (rating === (rating>=1 && rating<2) || (rating>=2 && rating<3) || (rating>=3 && rating<4) || (rating>=4 && rating<5) || 5 ) {
            let reviewSearch = await reviewModel.find({ rating ,isDeleted: false })
            if (!(reviewSearch.length > 0)) {
              return res.status(404).send({ status: false, message: `No review found for rating ${rating}` });
            }
            return res.status(200).send({ status: true, message: 'searched Product list', data: reviewSearch });
          }
        }
    catch (err) {
        return res.status(500).send(err.message);
      }
}
