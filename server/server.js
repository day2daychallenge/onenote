const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello from OneNote server!')
})

app.listen(port, () => {
  console.log(`app server listening at http://localhost:${port}`)
})