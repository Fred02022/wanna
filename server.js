const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const api = require('./route');
const axios = require('axios');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api)

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'))
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(8000, function () {
    console.log('8000 port is listening!')
})