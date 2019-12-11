const express = require('express');
const paginate = require('express-paginate');
const devysController = require('../controllers/devysController')

function routes(Devy){
    // All songs
    const devyRouter = express.Router();
    devyRouter.use(paginate.middleware(4, 10));
    const controller = devysController(Devy);
    
    devyRouter.route('/devy')
    .post(controller.post)
    .get(controller.get)
    .options(controller.options);

    // Middleware
    devyRouter.use('/devy/:devyId', (req, res, next) => {
        Devy.findById(req.params.devyId, (err, devy) => {
            if(err){
                return res.send(err);
            }
            if(devy){
                req.devy = devy;
                return next();
            } else {    
                return res.sendStatus(404);}
        });
    });

    // Single song by id
    devyRouter.route('/devy/:devyId')
        .get((req, res) => {
            const returnDevy = req.devy.toJSON();
            returnDevy._links = {};
            const band = req.devy.band.replace(/\s/g, '%20');
            const album = req.devy.album.replace(/\s/g, '%20');
            const genre = req.devy.genre.replace(/\s/g, '%20');
            returnDevy._links.FilterByThisBand = {};
            returnDevy._links.FilterByThisBand.href = `http://${req.headers.host}/api/devy/?band=${band}`;
            returnDevy._links.FilterByThisAlbum = {};
            returnDevy._links.FilterByThisAlbum.href = `http://${req.headers.host}/api/devy/?album=${album}`;
            returnDevy._links.FilterByThisGenre = {};
            returnDevy._links.FilterByThisGenre.href = `http://${req.headers.host}/api/devy/?genre=${genre}`;
            returnDevy._links.collection = {};
            returnDevy._links.collection.href = `http://${req.headers.host}/api/devy/`;

            return res.json(returnDevy);
        })
        .put((req, res) => {
            const { devy } = req;
            devy.name = req.body.name;
            devy.band = req.body.band;
            devy.album = req.body.album;
            devy.genre = req.body.genre;
            devy.heard = req.body.heard;
            req.devy.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(devy);
            });
        })     
        .patch((req, res) => {
            const { devy } = req;
            
            if(req.body._id) {
                delete req.body._id;
            }
            Object.entries(req.body).forEach(item => {
                const key = item[0];
                const value = item[1];
                devy[key] = value;
            })
            req.devy.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(devy);
            });
        })
        .delete((req, res) => {
            req.devy.remove((err) => {
                if(err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            });
        })
        .options((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
            res.header('Access-Control-Allow-Content-Type', 'Application/json,  x-www-form-urlencoded')
            res.sendStatus(200);
        });   
    return devyRouter;
}

module.exports = routes;