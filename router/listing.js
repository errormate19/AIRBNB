const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//create route
router.post(
  "/", // Changed from "" to "/"
  validateListing,
  wrapAsync(async (req, res, next) => {
    const new_listing = new Listing(req.body.listing);
    await new_listing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true }
    );

    if (!updatedListing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`); // Fixed redirect path
  })
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings"); // Fixed redirect path
  })
);

// Review creation route - Fixed route path
router.post(
  "/:id/reviews", // Added proper route path
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete Review Route
router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`); // Fixed redirect path
  })
);

module.exports = router;
