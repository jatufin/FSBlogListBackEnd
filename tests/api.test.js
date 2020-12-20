const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const testData = require('./test_data')
const initialBlogs = testData.initialBlogs
const testUsers = testData.testUsers
const blogsInDb = testData.blogsInDb

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const login = async (user) => {
  const response = await api
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password
    })
  
  return response.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)

  await User.deleteMany({})
  
  for(let i=0; i < testUsers.length; i++) {
    const passwordHash = await bcrypt.hash(testUsers[i].password, 10)
    const user = new User({
      username: testUsers[i].username,
      name: testUsers[i].name,
      passwordHash
    })

    await user.save()
  }
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
    const token = await login(testUsers[0])

    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(newBlog.title)
  })

  test('invalid blog entry is rejected', async () => {
    const token = await login(testUsers[0])

    // title is missing
    let newBlog = {
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
    
    // url is missing
    newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
    
    // title and url is missing
    newBlog = {
      author: 'Phil Plait',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)    
  })

  test('adding entry without authorization token fails', async () => {
    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('missing number of likes is given value zero', async () => {
    const token = await login(testUsers[0])

    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    expect(response.body.likes).toBe(0)
  })

  test('an entry can be deleted', async () => {
    const token = await login(testUsers[0])

    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
    
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    
    const blogsAtEnd = await blogsInDb()    
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(createdBlog.body.id)
  })

  test('user can not delete an entry of another user', async () => {
    const tokenForCreation = await login(testUsers[0])

    const newBlog = {
      title: 'Bad astronomy',
      author: 'Phil Plait',
      url: 'https://www.syfy.com/tags/bad-astronomy',
      likes: 0
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForCreation}`)
      .send(newBlog)

    const tokenForDeletion = await login(testUsers[1])

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `bearer ${tokenForDeletion}`)
      .expect(401)
  })

  test('an entry can be modified', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToModify = blogsAtStart[0]

    modifiedValue = {
      likes: blogToModify.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(modifiedValue)
      .expect(200)

    const modifiedBlog = response.body
    expect(modifiedBlog.likes).toBe(blogToModify.likes + 1)
  })
})


afterAll(() => {
  mongoose.connection.close()
})