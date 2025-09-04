// const mongoose = require("mongoose");
//const Schema = mongoose.Schema;


// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },

//   description: String,
//   image: {
//     type: String,
//     default:
//       "https://unsplash.com/photos/heres-a-caption-the-blood-moon-shines-brightly-in-the-night-sky-DahRk3xZIok",
//     set: (v) =>
//       v === ""
//         ? "https://unsplash.com/photos/heres-a-caption-the-blood-moon-shines-brightly-in-the-night-sky-DahRk3xZIok"
//         : v,
//   },

//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://unsplash.com/photos/heres-a-caption-the-blood-moon-shines-brightly-in-the-night-sky-DahRk3xZIok"
    }
  },
  price: Number,
  location: String,
  country: String,
  review:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
await Review.deleteMany({_id:{$in: listing.review}});
  }
  
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;