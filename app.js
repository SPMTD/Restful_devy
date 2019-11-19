const express = require('express');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connect('mongodb://127.0.0.1:27017/devyAPI');
const devyRouter = express.Router();
const port = process.env.PORT || 3000;
const Devy = require('./models/devyModel');

devyRouter.route('/devy')
    .get((req, res) => {
        Devy.find((err, devys) => {
            if(err){
                return res.send(err);
            }
            return res.json(devys);
        });
    });

app.use('/api', devyRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log('Running on port: ' + port);
});