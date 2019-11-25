const express = require('express');

function routes(Devy){
    // All songs
    const devyRouter = express.Router();
    devyRouter.route('/devy')
    .post((req, res) => {
        const devy = new Devy(req.body);
        
        devy.save();
        return res.status(201).json(devy);
    })
    .get((req, res) => {
        const query = {};
        if(req.query.name){
            query.name = req.query.name;
        }
        Devy.find(query, (err, devy) => {
            if(err){
                return res.send(err);
            }
            return res.json(devy);
        });
    });
    // Middleware
    devyRouter.use('/devy/:devyId', (req, res, next) => {
        Devy.findById(req.params.devyId, (err, devy) => {
            if(err){
                console.log("Teringzooi");
                return res.send(err);
            }
            if(devy){
                console.log("Kankerzooi");
                req.devy = devy;
                return next();
            } else {    
                return res.sendStatus(404);}
        });
    });
    // Single song by id
    devyRouter.route('/devy/:devyId')
        .get((req, res) => res.json(req.devy))
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