/*global __dirname, require */
'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json()); // for Content-Type 'application/json'
app.use(bodyParser.text()); // for Content-Type 'text/plain'
// for Content-Type 'application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

const port = app.get('port');
app.listen(port, () => console.log('started on port', port));
