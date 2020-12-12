const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

const config = require('./utils/config')

// const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
