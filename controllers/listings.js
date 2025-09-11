const Listing = require("../models/listing");

module.exports.index =async (req, res) => {
  const allListings = await Listing.find({});
  // allListings.forEach(listing => console.log(listing.image));
  res.render("listings/index.ejs", { allListings });
}; 

module.exports.renderNewform = (req, res) => {
  console.log(req.user);
  
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  })
  .populate("owner");
  if (!listing) {
    req.flash("error","Listing you requested for does not exist");
    return res.redirect("/listings");
    // throw new ExpressError("Listing not found", 404);
    
  }
  console.log(listing);// 
  res.render("listings/show.ejs", { listing })
  };
  module.exports.searchListings = async (req, res) => {
    try {
        const searchTerm = req.query.q || "";
        const results = await Listing.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } }
            ]
        });

        res.render("listings/searchResults", { results, searchTerm });
    } catch (err) {
        console.error(err);
        res.status(500).send("Search failed");
    }
};

module.exports.searchListings = async (req, res) => {
    try {
        const searchTerm = req.query.q || "";
        const results = await Listing.find({
            $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { description: { $regex: searchTerm, $options: "i" } }
            ]
        });

        res.render("listings/searchResults", { results, searchTerm });
    } catch (err) {
        console.error(err);
        res.status(500).send("Search failed");
    }
};


module.exports.createListing = async (req, res,next) => {
  let url = req.file.path;
  let filename= req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};
//   try {
//     console.log("Inside createListing...");
//     console.log("User:", req.user);
//     console.log("Body:", req.body);
//     console.log("File:", req.file);

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     if (req.file) {
//       newListing.image = {
//         filename: req.file.filename,
//         url: req.file.path,
//       };
//     }

//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
//   } catch (err) {
//     console.error("Create Listing Error:", err);
//     next(err); // Pass to error handler
//   }
// };
  

  module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error","Listing you requested for does not exist");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/h_300,w_2500",'/upload');
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }

module.exports.updateListing = async (req, res) => {
  
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

  if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename= req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  
  // Trim image URL safely
  // if (updatedData.image && updatedData.image.url) {
  //   updatedData.image.url = updatedData.image.url.trim();
  // }

  // const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
  // if (!updatedListing) {
  //   throw new ExpressError("Listing not found for update", 404);
  // }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}