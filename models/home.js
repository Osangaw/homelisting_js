const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['rent', 'sale'],
    required: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "Nigeria"
  },
  location: { // This represents City/State
    type: String,
    required: true,
    trim: true
  },
  address: { // This represents House No / Street
    type: String,
    required: true,
    trim: true
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
    default: 0
  },
  image: { 
    type: String 
  },
  images: [
    {
      img: { type: String, required: true },
      public_id: { type: String } 
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Home = mongoose.model("Home", homeSchema);
module.exports = Home;