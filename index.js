const config = require('./utils/config')
const http = require('http')
const app = require('./app')

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
