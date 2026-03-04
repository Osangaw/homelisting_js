const Home = require("../models/Home"); 
const { uploadFile } = require("../util/cloudinary");

exports.createHome = async (req, res) => {
  try {
    const { 
      title, description, price, category, 
      country, location, address, bedrooms, bathrooms, garage 
    } = req.body;

    let images = [];
    let mainImage = "";

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadFile(file.path));
      const uploadResults = await Promise.all(uploadPromises);

      images = uploadResults.map((result) => ({
        img: result.uri, 
        public_id: result.public_id,
      }));

      mainImage = images.length > 0 ? images[0].img : "";
    }

    const newHome = new Home({
      title,
      description,
      price,
      category,
      country,
      location,
      address,
      bedrooms,
      bathrooms,
      garage,
      image: mainImage,
      images: images,
      createdBy: req.user.id 
    });

    await newHome.save();
    return res.status(201).json({ message: "New home listed successfully", home: newHome });

  } catch (e) {
    console.error("Error in adding home:", e.message);
    if (e.name === "ValidationError") return res.status(400).json({ message: e.message });
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findOneHome = async (req, res) => {
  try {
    const { id } = req.params; 
    const findHome = await Home.findById(id).populate("createdBy", "fullName email");
    
    if (!findHome) {
      return res.status(404).json({ message: "Home not found" });
    }
    
    return res.status(200).json({ message: "Home found successfully", home: findHome });
  } catch (e) {
    return res.status(500).json({ message: "Error finding home" });
  }
};

exports.allHomes = async (req, res) => {
  try {
    // Logic: Added sort to show newest listings first
    const homes = await Home.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: homes.length, homes });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateHome = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedHome = await Home.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedHome) {
      return res.status(404).json({ message: "Home doesn't exist" });
    }

    return res.status(200).json({ message: "Home updated successfully", home: updatedHome });
  } catch (e) {
    return res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteHome = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHome = await Home.findByIdAndDelete(id);

    if (!deletedHome) {
      return res.status(404).json({ message: "Home doesn't exist" });
    }

    return res.status(200).json({ message: "Home deleted successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Delete failed" });
  }

}