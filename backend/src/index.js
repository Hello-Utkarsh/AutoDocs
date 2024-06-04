const express = require('express')
const router = require('./tables/tables')
const parser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(parser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/table', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})