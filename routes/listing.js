const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/reviews.js");
const mongoose = require('mongoose');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../joiSchema.js");
const multer  = require('multer');
const {cloudinary, storage} = require("../cloudConfig.js");
const upload = multer({ storage });

/* isAuthenticated */
const {isAuthenticated, isOwner, validateListing} = require("../middleware.js");

const {index, show, renderEditForm, update, Delete, renderNewForm, addNewList} = require('../controller/listing.js');
// Create Route
router.get("/new",isAuthenticated, renderNewForm);

router.route("/")
    .get(wrapAsync(index))
    .post(isAuthenticated,upload.single('list[image]'),validateListing,wrapAsync(addNewList));

// Show Route
router.route("/:id")
    .get(wrapAsync(show))
    .patch(isAuthenticated, isOwner, upload.single('list[image]'),validateListing,wrapAsync(update))
    .delete(isAuthenticated, isOwner, wrapAsync(Delete));

// edit or update..
router.get("/:id/edit",isAuthenticated, isOwner, wrapAsync(renderEditForm));

module.exports = router; 