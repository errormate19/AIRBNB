const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// let allList= new Listing({
//   title: "Payal",
//   description: "Hi I am brave",
//   price: 1200,
//   location: "goa",
//   country: "India",
// });

// const initDB= async()=>{
//     await Listing.deleteMany({});
//     await Listing.insertOne(allList);
// }

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
