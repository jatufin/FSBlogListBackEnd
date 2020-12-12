const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

require('dotenv').config()
let MONGODB_URI=process.env.MONGODB_URI
let PORT = process.env.PORT

// const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
