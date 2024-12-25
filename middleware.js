const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const {listingSchema, reviewSchema} = require("./joiSchema.js");
module.exports.isAuthenticated = (req,res,next)=>{
    if(!req.isAuthenticated()){
        let url = req.originalUrl;
        let cleanUrl = url.split('?')[0];
        console.log(cleanUrl);
        // Extract the desired portion
        let startIndex = cleanUrl.indexOf('/listings'); // Find where '/listings' starts
        let extracted = cleanUrl.substring(startIndex);
        req.session.url = extracted;
        req.flash("error", "Please login");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.url){
        res.locals.url = req.session.url;
    } 
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

/* Validate listing -> Server side */
module.exports.validateListing = (req,res,next)=>{
    //console.log(req.body);
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        // let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        // let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}