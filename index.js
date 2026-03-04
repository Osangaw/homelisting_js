const express = require("express")
const app = express()
const cors = require("cors") // 1. Import cors
const dotenv = require("dotenv")
const connectDB = require("./dB")
const authRoute = require("./routes/authRoute")
const homeRoute = require("./routes/homeRoute")

dotenv.config()

app.use(cors()) 

app.use(express.json())

PORT = process.env.PORT || 9000

app.use("/auth", authRoute)
app.use("/homes", homeRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB() 
})