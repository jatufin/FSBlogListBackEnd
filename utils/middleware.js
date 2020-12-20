const unknownEndpoint = (request, response) => {
  response.status(400).send( {
    error: 'unknown endpoint'
  })
}

const errorHandler = (err, req, res, next) => {
  
  if(err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }

  if(err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid token' })
  }

  next(err)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('Authorization')

  if(auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7)
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}