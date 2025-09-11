const express=require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage}= require("../cloud_config.js");
const upload = multer({ storage });

router.get("/search", listingController.searchListings);
router.route("/")
.get(wrapasync(listingController.index))

.post(isLoggedIn,  upload.single('listing[image]'), validateListing, wrapasync(listingController.createListing));
// New form
router.get("/new",isLoggedIn, listingController.renderNewform);



router.route("/:id")
.get(wrapasync( listingController.showListing))
.put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapasync( listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapasync(listingController.deleteListing));




// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapasync( listingController.editListing));

module.exports = router;