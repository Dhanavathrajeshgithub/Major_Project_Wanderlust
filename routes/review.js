const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const Review = require("../models/reviews.js");
const mongoose = require('mongoose');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../joiSchema.js");
const {validateReview, isAuthenticated, isReviewAuthor} = require('../middleware.js');

const {postReview, destroyReview} = require('../controller/review.js');
/* Post Route for review */
router.post("/",isAuthenticated, validateReview,wrapAsync(postReview));
/* Delete route for review */
router.delete("/:reviewId",isAuthenticated,isReviewAuthor,wrapAsync(destroyReview));

module.exports = router;