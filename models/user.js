const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
  accountType: {
   type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
// export default User;