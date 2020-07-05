const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()

const routes = require('./routes/routes');

const app = express();
app.use(cors({origin:true,credentials: true})); // allow cors headers
app.use(bodyParser.json());

const key = fs.readFileSync(__dirname + '/certs/privkey.key');
const cert = fs.readFileSync(__dirname + '/certs/certificate.crt');
const options = {
  key: key,
  cert: cert
};

const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'x-auth,Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'x-auth,Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => { res.send('API is running.') });

app.use('/', routes);

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app }