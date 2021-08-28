const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello from OneNote server!')
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
})

app.put('/note', function (req, res) {
    res.send('Got a PUT request at /note')
})

app.delete('/note', function (req, res) {
    res.send('Got a DELETE request at /note')
})

app.listen(port, () => {
  console.log(`app server listening at http://localhost:${port}`)
})