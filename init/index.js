const mongoose = require("mongoose");
const sampleListings = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  let id = '6766d949c2bc9e444c07535f';
  let newArr = sampleListings.map((arr)=>{
    arr.owner = id;
    return arr;
  })
  await Listing.deleteMany({});
  await Listing.insertMany(newArr);
  console.log("data was initialized");
};

initDB();