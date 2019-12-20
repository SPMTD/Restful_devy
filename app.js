const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/devyAPI');
const port = process.env.PORT || 3000;
const Devy = require('./models/devyModel');
const devyRouter = require('./routes/devyRouter')(Devy);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());  

app.use(function (req, res, next) {
    if (req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Allow-Origin', '*');
        res.setHeader("Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
    } else {
        res.status(406).send({
            error: "We only accept application/json & application/x-www-form-urlencoded."
        })
    }
});

app.use('/api', devyRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log('Running on port: ' + port);
});