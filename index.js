const express = require("express")
const app = express()
const dotenv = require("dotenv")
const connectDB = require("./dB")
const authRoute = require("./routes/authRoute")
const homeRoute = require("./routes/homeRoute")
dotenv.config()
app.use(express.json())

PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB() 
})
app.use("/auth", authRoute)
app.use("/home", homeRoute)