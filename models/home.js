const { default: mongoose } = require("mongoose");

const homeSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  garage: {
    type: Number,
    required: true,
  }
},({ timestamps: true }));

const Home = mongoose.model("Home", homeSchema);
module.exports = Home;
