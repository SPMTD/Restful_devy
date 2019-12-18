// const paginate = require('express-paginate');

function devysController(Devy) {
    function post(req, res) {
        const devy = new Devy(req.body);
        // console.log(devy);
        if(devy.name === null || devy.band === null || devy.album === null || devy.genre === null) {
            return res.sendStatus(403);
        }

        devy.save();
        return res.status(201).json(devy);        
        
    }
    // function get(req, res) {
        // const perPage = req.query.limit || 0;
        // const page = req.query.start || 1;     
        // const query = {};
        // if(req.query.name){
        //     query.name = req.query.name;
        // } else if(req.query.band) {
        //     query.band = req.query.band;
        // } else if(req.query.album) {
        //     query.album = req.query.album;
        // } else if(req.query.genre) {
        //     query.genre = req.query.genre;
        // }
        // Devy.find(query, (err, devy) => {
        //     if(err){
        //         return res.send(err);
        //     }
        //     devy.skip((perPage * page) - perPage);
        //     devy.limit(perPage);
        //     const items = [];
        //     const returnDevys = devy.map((devy) => {
        //         const newDevy = devy.toJSON();
        //         newDevy._links = {};
        //         newDevy._links.self = {};
        //         newDevy._links.self.href = `http://${req.headers.host}/api/devy/${devy._id}`;
        //         newDevy._links.collection = {};
        //         newDevy._links.collection.href = `http://${req.headers.host}/api/devy/`;
        //         return newDevy;
        //     });
        //     items.items = returnDevys;
        //     // console.log(itemCount);
        //     return res.json(items);
        // });
    // }

    function get(req, res, err) {
        const perPage = req.query.limit || 0;
        const page = req.query.start || 1;         
        const query = {};
        if(req.query.name){
            query.name = req.query.name;
        } else if(req.query.band) {
            query.band = req.query.band;
        } else if(req.query.album) {
            query.album = req.query.album;
        } else if(req.query.genre) {
            query.genre = req.query.genre;
        }
        Devy.find({})    
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, devy) {
                Devy.countDocuments().exec(function (err, count) {
                    if (err) {
                        res.send(err);
                    }
                    const items = [];                    
                    for(i = 0; i < devy.length; i++) {
                        const item = devy[i].toJSON();
                        item._links = {
                            self: {
                                href: `http://${req.headers.host}/api/devy/${item._id}`
                            }
                        };
                        items.push(item);
                    }
                    const collection = {
                        items: items,
                        _links: {
                            self: {
                                href: `http://${req.headers.host}/api/devy/`
                            }
                        },
                        
                        pagination: {
                            currentPage: page,
                            currentItems: perPage,
                            totalPages: Math.ceil(count/perPage),
                            totalItems: count,
                            _links: {
                                first: {
                                    page: 1,
                                    href: `http://${req.header.host}/api/devy/?start=${page}&limit=${perPage}`
                                }
                            }
                        }
                    };
                    if(err){
                        return res.send(err);
                    } else{
                        return res.json(collection);
                    }                    
                })
            });
    //         const items = [];
    //         const returnDevys = devy.map((devy) => {
    //             const newDevy = devy.toJSON();
    //             newDevy._links = {};
    //             newDevy._links.self = {};
    //             newDevy._links.self.href = `http://${req.headers.host}/api/devy/${devy._id}`;
    //             newDevy._links.collection = {};
    //             newDevy._links.collection.href = `http://${req.headers.host}/api/devy/`;
    //             return newDevy;
    //         });
    //         items.item = returnDevys;
    //         return res.json(items);
        // console.log(items);
        // return res.json(items);
    }


    function options(req, res, err) {
        res.header('Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        res.header('Allow-Header', 'Content-Type, Accept')
        res.header('Access-Control-Allow-Content-Type', 'application/json,  x-www-form-urlencoded');
        res.header('Allow-Content-Type', 'application/json, x-www-form-urlencoded');
        res.header('Access-Control-Allow-Accept', 'application/json,  x-www-form-urlencoded');
        res.header('Allow-Accept', 'application/json, x-www-form-urlencoded');              

        if(!res.header('Allow-Accept', 'application/json, x-www-form-urlencoded') ||
         !res.header('Access-Control-Allow-Accept', 'application/json, x-www-form-urlencoded')) {
            res.sendStatus(400);
         } else{
            res.sendStatus(200);
         }
        // return res.sendStatus(200);
    }    

    return {post, get, options};
}

module.exports = devysController;