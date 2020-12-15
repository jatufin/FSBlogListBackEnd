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

  test('a blog can be added', async () => {
    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(newBlog.title)
  })

  test('missing number of likes is zero', async () => {
    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)

    expect(response.body.likes).toBe(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})