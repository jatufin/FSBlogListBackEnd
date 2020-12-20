const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })

    response.json(blogs.map(b => b.toJSON()))    
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.title || !body.url) {
        response.status(400)
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!request.token || !decodedToken || !decodedToken.id) {
        throw({ name: 'JsonWebTokenError' })
    }

    const user = await User.findById(decodedToken.id)

    if(!body.likes) {
        body.likes = 0
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()
    console.log("BLOG ID: ", savedBlog._id)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!request.token || !decodedToken || !decodedToken.id) {
            throw({ name: 'JsonWebTokenError' })
    }

    console.log("REQUEST TOKEN ID: ", decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== decodedToken.id.toString()) {
        throw({ name: 'UnauthorizedRequest' } )
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()  
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const id = request.params.id

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter