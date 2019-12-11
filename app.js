const express = require('express');
const paginate = require('express-paginate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/devyAPI');
const port = process.env.PORT || 3000;
const Devy = require('./models/devyModel');
const devyRouter = require('./routes/devyRouter')(Devy);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());  

app.use(paginate.middleware(10, 50));

app.use('/api', devyRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log('Running on port: ' + port);
});