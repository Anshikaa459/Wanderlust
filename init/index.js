if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
  // console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME); // debug
}
const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const dbUrl = process.env.ATLASDB_URL;
// console.log(process.env.ATLASDB_URL);
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log('connection successfull');

    initdb();
  })
  .catch((err) => console.log(err));

const initdb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '683dcc00e0fd12cdfdadae7e' }));
  //     console.log("initdata is:", initdata);
  // console.log("initdata.data is:", initdata.data);

  await Listing.insertMany(initdata.data);
  console.log('data was saved');
};

// initdb();
