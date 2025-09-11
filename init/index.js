const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

main()
  .then(() => {
    console.log('connection successfull');
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    'mongodb+srv://anshikaj341:WjUQUthY9j0SATrj@cluster0.c80reqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  );
}

const initdb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '683dcc00e0fd12cdfdadae7e' }));
  //     console.log("initdata is:", initdata);
  // console.log("initdata.data is:", initdata.data);

  await Listing.insertMany(initdata.data);
  console.log('data was saved');
};

initdb();
