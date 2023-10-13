const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const config = require('dotenv').config().parsed;

const cors = require('cors');

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(app.get('port'));
console.log('Listening on port: ', app.get('port'));
