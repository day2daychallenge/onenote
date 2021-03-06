"use strict";

const express = require('express')
const app = express()
const port = 5000
const ServerResponse = require('./serverResponse.js');

var headers = {};

const apiKeys = ['amir-auth-code', 'ramin-auth-code', 'davod-auth-code'];
const userIds = ['amir','ramin','davod'];
const sampleMarkup = [  '# The largest heading'
                        ,'## The second largest heading\n'+
                         '###### The smallest heading'
                        ,'# onenote server\n'+
                        'This project suppose to handle all the client request in local.\n\n'+
                        '# How to run onenote server\n'+
                        'In order to run this server you need to make sure that node installed in your pc.'
                        ,'## Installation\n\n'+
                        'You need to install [node](https://nodejs.org/en/download/) to run this project.\n'+
                        'inorder to make sure that your system has a node, please run the below command:\n\n'+
                        '```bash\n'+
                        'node -v\n'+
                        '```\n'
                        ,'## How to use the API\n\n'+
                        'Currently below api supported in server. we are using port 5000:\n\n'+
                        '1.  Hello OneNote\n'+
                        '    -   http://localhost:5000/      ***Type: GET***\n\n'+
                        '2.  All the API after ***/api*** require authorization code. you can set it by creating a header named ***authorization***\n'+
                        '    -   currently three value hardcoded for the testing purpose, later this value will be generated by AWS Cognito service.\n'+
                        '        -   amir-auth-code\n'+
                        '        -   ramin-auth-code\n'+
                        '        -   davod-auth-code\n'
                    ]

// establish a status for an error. in our custom error handler, we can then use the property.
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}
// generate a random intiger file
function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

// mounting middlewware to /api to validate the API key,
// therefore a path with prefixed "/api"  will cause middleware
// to be invoked
app.use('/api', function(req, res, next){
    var key = req.get('authorization');

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
app.get('/api', (req, res, next) => {
    res.send(new ServerResponse({ body : {message:'Hello from OneNote server!'}}));
})

app.get('/api/user', (req, res, next) => {
    let userId = req.query['id'];
    let numId = req.query['num'];

    // user ID isn't present
    if (!userId) return next(error(400, 'id is required'));
    // Number of message isn't present
    if (!numId)
        numId = 1;

    // key is invalid
    if (!~userIds.indexOf(userId)) return next(error(401, 'invalid user ID'));

    let arrIndex = 0;
    var messageList = {items: []};
    var tomorrow = new Date();

    for (let index = 0; index < numId; index++) {
        // To do it in local time
        tomorrow.setDate(tomorrow.getDate() + 1);

        messageList.items[index] = {
            id:index,
            name: userId,
            date: `${tomorrow.getTime()}`,
            message: `## Message ${index} for ${userId}.\n\n${sampleMarkup[arrIndex]}` ,
            emoji:[
                {
                    name: "smile",
                    likes: getRandomNumber(10)
                },
                {
                    name: "sad",
                    likes: getRandomNumber(10)
                },
                {
                    name: "angry",
                    likes: getRandomNumber(10)
                }
            ]
        };
        arrIndex++;
        if(sampleMarkup.length <= arrIndex)
            arrIndex = 0;
    }

    res.send(new ServerResponse({ body : {messageList}}));
})
  
app.post('/api', function (req, res, next) {
    res.send(new ServerResponse({ body : {message:'Got a POST request'}}));
})

app.put('/api/note', function (req, res, next) {
    res.send(new ServerResponse({ body : {message:'Got a PUT request at /note'}}));
})

app.delete('/api/note', function (req, res, next) {
    res.send(new ServerResponse({ body : {message:'Got a DELETE request at /note'}}));
})

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
    res.status(404);
    res.send({ error: "Opss!, api not found!" });
});

app.listen(port, () => {
  console.log(`app server listening at http://localhost:${port}`)
})