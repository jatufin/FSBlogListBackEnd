const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
  
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if(!body.password || body.password.length < 3) {
    throw({
      name: 'ValidationError',
      message: 'Password missing or too short'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(
    body.password,
    saltRounds
  )

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser.toJSON())
})

module.exports = usersRouter