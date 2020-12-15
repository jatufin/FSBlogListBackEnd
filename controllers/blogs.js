const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs.map(b => b.toJSON()))
    } catch(e) {
        next(e)
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    
    if(!body.title || !body.url) {
        response.status(400)
    }
    
    if(!body.likes) {
        body.likes = 0
    }

    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
})

module.exports = blogsRouter