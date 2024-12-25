const mongoose = require('mongoose');
const Review = require("./reviews.js");
const User = require("./user.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: mongoose.Schema.Types.Mixed, // Allows multiple types
        validate: {
          validator: function (value) {
            return (
              Array.isArray(value) || 
              value === null || 
              typeof value === 'string'
            );
          },
          message: 'Category must be an array, null, or a string',
        },
        enum: ["Trending", "Rooms", "iconic cities", "Castles", "Farm", "Mountains", "Amazing pools", "Arctic", "Camping", "Beach", "National park","Desert"]
    }
});
/* Post Middleware for listing delete */
listingSchema.post("findOneAndDelete",async (list)=>{
    if(list){
        await Review.deleteMany({_id: {$in: list.reviews}});
    }
});

const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing;