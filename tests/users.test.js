const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const testData = require('./test_data')
const testUsers = testData.testUsers
const usersInDb = testData.usersInDb

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('When there is one initial user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const testUser = testUsers[0]

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(testUser.password, saltRounds)

    const user = new User({
      username: testUser.username,
      name: testUser.name,
      passwordHash
    })

    await user.save()
  })

  test('return the only user in db', async () => {
    const result = await api.get('/api/users')
    const testUser = testUsers[0]

    expect(result.body).toHaveLength(1)
    expect(result.body[0].username).toBe(testUser.username)
  })

  test('adding a valid user succeeds', async () => {
    const usersAtStart = await usersInDb()

    const newUser = testUsers[1]

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('adding an user with existing username fails', async () => {
    const usersAtStart = await usersInDb()

    let newUser = {
      username: testUsers[0].username,
      name: testUsers[1].name,
      password: testUsers[1].password
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding an user with too short username fails', async () => {
    const usersAtStart = await usersInDb()

    let newUser = {
      username: 'AB',
      name: testUsers[1].name,
      password: testUsers[1].password
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding an user with too short password fails', async () => {
    const usersAtStart = await usersInDb()
    
    let newUser = {
      username: testUsers[1].username,
      name: testUsers[1].name,
      password: "AB"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding an user with missing username fails', async () => {
    const usersAtStart = await usersInDb()
    
    let newUser = {
      name: testUsers[1].name,
      password: testUsers[1].password,
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('adding an user with missing password fails', async () => {
    const usersAtStart = await usersInDb()
    
    let newUser = {
      username: testUsers[1].username,
      name: testUsers[1].name,
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})