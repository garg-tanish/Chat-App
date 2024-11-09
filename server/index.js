require('dotenv').config()
const cors = require('cors')
const express = require('express')
const router = require('./routes')
const cookiesParser = require('cookie-parser')
const connectDB = require('./config/connectDB')
const { app, server } = require('./socket')

const PORT = process.env.SERVER_PORT || 8080

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())

app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    })
})

app.use('/api', router)

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("server running at " + PORT)
    })
})
