import express from 'express';
import table from './tables/tables.js';
import docs from './docs/docs.js';
import parser from 'body-parser';
import cors from 'cors';
import user from './user.js';
import blog from './blog.js';
import chat from './chat.js';
const app = express()
const port = 3000

app.use(cors())
app.use(parser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/table', table)
app.use('/docs', docs)
app.use('/user', user)
app.use('/blog', blog)
app.use('/chat', chat)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})