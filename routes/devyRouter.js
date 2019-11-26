const express = require('express');
const devysController = require('../controllers/devysController')

function routes(Devy){
    // All songs
    const devyRouter = express.Router();
    const controller = devysController(Devy);

    devyRouter.route('/devy')
    .post(controller.post)
    .get(controller.get);
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

            returnDevy.links = {};
            const band = req.devy.band.replace(/\s/g, '%20');
            const album = req.devy.album.replace(/\s/g, '%20');
            const genre = req.devy.genre.replace(/\s/g, '%20');
            returnDevy.links.FilterByThisBand = `http://${req.headers.host}/api/devy/?band=${band}`;
            returnDevy.links.FilterByThisAlbum = `http://${req.headers.host}/api/devy/?album=${album}`;
            returnDevy.links.FilterByThisGenre = `http://${req.headers.host}/api/devy/?genre=${genre}`;

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
        });   
    return devyRouter;
}

module.exports = routes;