const Home = require("../models/home");

exports.createHome = async (req, res) => {
  const { location, price, description, bedrooms, bathrooms, garage, kitchen } =
    req.body;
  try {
    const newHome = new Home({
      location,
      price,
      description,
      bedrooms,
      bathrooms,
      garage,
    });
    await newHome.save();
    console.log("home listed successfully", newHome);
    return res
      .status(201)
      .json({ message: "new home listed successfully", newHome });
  } catch (e) {
    console.log("error in adding home", e);
    return res.status(500).json({ message: "Internal sever error" });
  }
};
exports.findOneHome = async (req, res) => {
  try {
    const { id } = req.body;
    const findHome = await Home.findOne({ id });
    if (!findHome) {
      console.log("Home not found");
      return res.status(500).json({ message: "Home not found" });
    }
    console.log("Home found successfully", findHome);
    return res.status(200).json({ message: "Home found Successfully" });
  } catch (e) {
    console.log("error in finding home", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.allHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    console.log("All homes retrieved successfully", homes);
    return res.status(200).json({ homes });
  } catch (e) {
    console.log("error in retreiving homes", e);
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.updateHome = async (req, res) => {
  const { id } = req.params;
  try {
    const home = await Home.findOne({ _id: id });
    if (!home) {
      return res.status(200).json({ message: "Home doesnt exist" });
    }
    (home.location = req.body.location),
      (home.price = req.body.price),
      (home.description = req.body.description),
      (home.bedrooms = req.body.bedrooms),
      (home.bathrooms = req.body.bathrooms),
      (home.garage = req.body.garage);
    const update = await home.save();
    if (update) {
      console.log("Home was updated successfully", home);
      return res.status(200).json({ message: "Home updated successfully" });
    }
  } catch (e) {
    console.log("Internal server error", e);
  }
};

exports.deleteHome = async (req, res) => {
  const { id } = req.params;
  try {
    const home = await Home.findOneAndDelete({ _id: id });
    if (!home) {
      return res.status(200).json({ message: `home with ${id} doesnt exist` });
    }
    console.log("home deleted successfully", home);
    return res.status(200).json({ message: "home deleted successfully" });
  } catch (err) {
    console.log("error in deleting home", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
