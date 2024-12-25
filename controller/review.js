const Review = require("../models/reviews");
const Listing = require("../models/listing");

module.exports.postReview = async(req,res)=>{
    let list = await Listing.findById(req.params.id).populate("reviews");
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    req.flash("success", "new review added successfully!");
    res.redirect(`/listings/${list._id}`);
};

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted successfully!");
    res.redirect(`/listings/${id}`);
};