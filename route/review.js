const express = require('express');
const router = express.Router();



const reviewController = require("../controllers/review.js");
const middleware = require("../middleware/authenticateUser");


router.post("/reviewCreate",middleware.authenticateToken,reviewController.reviewCreate)
router.put("/product/reviewUpdate",middleware.authenticateToken,reviewController.reviewUpdate)
router.delete("/product/reviewDelete",middleware.authenticateToken,reviewController.reviewDelete)
router.get("/reviewGet",reviewController.review_Get_For_Specific_Product)
router.get("/reviewRating",reviewController.review_Get_By_Their_Ratings)

module.exports = router;