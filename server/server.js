"use strict";

const express = require('express')
const app = express()
const port = 5000
const ServerResponse = require('./serverResponse.js');

var headers = {};

const apiKeys = ['amir-auth-code', 'ramin-auth-code', 'davod-auth-code'];

// establish a status for an error. in our custom error handler, we can then use the property.
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// mounting middlewware to /api to validate the API key,
// therefore a path with prefixed "/api"  will cause middleware
// to be invoked
app.use('/api', function(req, res, next){
    var key = req.query['authorization'];

    // key isn't present
    if (!key) return next(error(400, 'api key required'));

    // key is invalid
    if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

    // all good, store req.key for route access
    req.key = key;
    next();
});

app.get('/', (req, res) => {
  res.send(new ServerResponse({ body : {message:'Hello from OneNote server!'}}));
})

// we now can assume the api key is valid,
// and simply expose the data
app.get('/api', (req, res) => {
    res.send(new ServerResponse({ body : {message:'Hello from OneNote server!'}}));
})
  
app.post('/api', function (req, res) {
    res.send(new ServerResponse({ body : {message:'Got a POST request'}}));
})

app.put('/api/note', function (req, res) {
    res.send(new ServerResponse({ body : {message:'Got a PUT request at /note'}}));
})

app.delete('/api/note', function (req, res) {
    res.send(new ServerResponse({ body : {message:'Got a DELETE request at /note'}}));
})

app.listen(port, () => {
  console.log(`app server listening at http://localhost:${port}`)
})