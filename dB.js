const mongoose = require("mongoose")    

MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://ybbetter:mrgrimreaper@cluster0.w5afadq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  //"mongodb://localhost:27017/homelistingapp";
      const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Database connected")
    } catch (error) {
        console.error("Database connection failed:", error)
        process.exit(1)
    }
}

module.exports = connectDB