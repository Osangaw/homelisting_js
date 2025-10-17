const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI
  );

    console.log(`MONGODB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error while connecting to DB, ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB