const initialBlogs = require('./test_data').initialBlogs
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('API tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('every record has field named "id"', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(item => {
      expect(item.id).toBeDefined() 
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})