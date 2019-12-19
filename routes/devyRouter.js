const express = require('express');
// const paginate = require('express-paginate');
const devysController = require('../controllers/devysController')

function routes(Devy){
    // All songs
    const devyRouter = express.Router();
    const controller = devysController(Devy);
    
    devyRouter.route('/devy/:start?/:limit?')
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
                host = req.header.host
                return next();
            } else {    
                return res.sendStatus(404);}
        });
    });

    // Single song by id
    devyRouter.route('/devy/:devyId')
        .get((req, res) => {
            const returnDevy = req.devy.toJSON();
            console.log(returnDevy);
            returnDevy._links = {};
            const band = returnDevy.band.replace(/\s/g, '%20');
            const album = returnDevy.album.replace(/\s/g, '%20');
            const genre = returnDevy.genre.replace(/\s/g, '%20');
            returnDevy._links.self = {};
            returnDevy._links.self.href = `http://${req.headers.host}/api/devy/${returnDevy._id}`;
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
            if(!devy.name || !devy.band || !devy.album || !devy.genre) {
                return res.sendStatus(403);
            } else {
                req.devy.save((err) => {
                    if (err) {
                        return res.send(err);
                    }
                    return res.json(devy);
                });
            }
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
            if (!res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Content-Type, Application/json, Content-Type, Application/x-www-form-urlencoded')) {
                res.sendStatus(416);
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader("Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
                res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Content-Type', 'Application/json,  Application/x-www-form-urlencoded');
                res.setHeader('Access-Control-Allow-Accept', 'Application/json,  x-www-form-urlencoded');
                return res.sendStatus(200);
            }
        });   
    return devyRouter;
}

module.exports = routes;