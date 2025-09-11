const express=require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController = require("../controllers/reviews.js");

// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(errMsg,400);
//   } else {
//     next();
//   }
// };

// reviews.
router.post("/:id/reviews",isLoggedIn, validateReview, wrapasync(reviewController.createReview));


//Delete review route
router.delete("/:id/reviews/:reviewId",isLoggedIn , isReviewAuthor,wrapasync(reviewController.destroyReview));

module.exports = router;