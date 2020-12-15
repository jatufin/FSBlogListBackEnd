const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (doc, retObj) => {
        retObj.id = retObj._id.toString()
        delete retObj._id
    }
})

module.exports = mongoose.model('Blog', blogSchema)