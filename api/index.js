const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.post('/', (req, res) => {
//})

module.exports = {
   path: '/api',
   handler: app
}
