function devysController(Devy) {
    function post(req, res) {
        const devy = new Devy(req.body);
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
        let perPage = parseInt(req.query.limit);
        let page = parseInt(req.query.start);  

        console.log(perPage);

        if (req.query.start === '' || req.query.limit === '') {
            perPage = 10;
            page = 0;
        }   
        Devy.find({})            
            .skip((page + 1) * perPage)
            .limit(perPage)
            .exec(function (err, devy) {
                Devy.countDocuments().exec(function (err, count) {        
                    console.log("count is: " + count + " en perPage is: " + perPage);                                                    
                    if(err) {
                        return res.send(err);
                    };
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
                            currentItems: items.length,
                            totalPages: Math.ceil(Number(count)/perPage),
                            totalItems: Number(count),
                            _links: {
                                first: {
                                    page: 1,
                                    href: `${hostUrl}?start=1&limit=${perPage}`
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


    function options(req, res, next) {
            if (!res.header('Access-Control-Allow-Headers', 'Content-Type, Accept , Content-Type, Application/json, Content-Type, Application/x-www-form-urlencoded')) {
                return res.sendStatus(416);
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.setHeader('Allow', 'GET, POST, OPTIONS');
                res.setHeader('Access-Control-Allow-Content-Type', 'Application/json,  Application/x-www-form-urlencoded');
                res.setHeader('Access-Control-Allow-Accept', 'Application/json,  x-www-form-urlencoded');
                return res.sendStatus(200);
            }
    }    

    return {post, get, options};
}

module.exports = devysController;