// const paginate = require('express-paginate');

function devysController(Devy) {
    function post(req, res) {
        const devy = new Devy(req.body);
        // console.log(devy);
        if(!req.body.name || !req.body.band || !req.body.album || !req.body.genre) {
            return res.sendStatus(403);
        }

        devy.save(function (err) {
            if(err) {
                res.send(err);
            } else {
                return res.status(201).json(devy);
            }
        });                
    }

    function get(req, res, err) {
        const perPage = req.query.limit;
        const page = req.query.start;
        if (req.query.start === '' || req.query.limit === '') {
            perPage = 10;
            page = 0;
        }         

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

        const hostUrl = `http://${req.headers.host}/api/devy/`


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
                            currentPage: Number(page),
                            currentItems: Devy.countDocuments(),
                            totalPages: Math.ceil(count/perPage),
                            totalItems: count,
                            _links: {
                                first: {
                                    page: 1,
                                    href: `${hostUrl}?start=${page}&limit=${perPage}`
                                },
                                last: {
                                    page: Math.ceil(count/perPage),
                                    href: `${hostUrl}?start=${Math.ceil(count/perPage)}&limit=${perPage}`
                                },
                                previous: {
                                    page: Number(page) - 1 || 1,
                                    href: `${hostUrl}?start=${Number(page)-1 || 1}&limit=${perPage}`
                                },
                                next: {
                                    page: Number(page) + 1 || Math.ceil(count/perPage),
                                    href: `${hostUrl}?start=${Number(page)+1}&limit=${perPage}`
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
    }


    function options(req, res, err) {
        if (!res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Content-Type, Application/json, Content-Type, Application/x-www-form-urlencoded')) {
            res.sendStatus(416);
        } else {
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
            return res.sendStatus(200);             
        }
    }    

    return {post, get, options};
}

module.exports = devysController;