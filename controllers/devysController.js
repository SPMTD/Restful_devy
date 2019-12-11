const paginate = require('express-paginate');

function devysController(Devy) {
    function post(req, res) {
        const devy = new Devy(req.body);
        
        devy.save();
        return res.status(201).json(devy);
    }
    function get(req, res) {
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
        Devy.find(query, (err, devy) => {
            if(err){
                return res.send(err);
            }
            const limit = req.query.limit;
            const offset = req.query.offset;
            const items = {};
            const returnDevys = devy.map((devy) => {
                const newDevy = devy.toJSON();
                newDevy._links = {};
                newDevy._links.self = {};
                newDevy._links.self.href = `http://${req.headers.host}/api/devy/${devy._id}`;
                newDevy._links.collection = {};
                newDevy._links.collection.href = `http://${req.headers.host}/api/devy/`;
                return newDevy;
            });
            const itemCount = devy.count;
            const pageCount = Math.ceil(devy.count / limit);
            const paginations = {pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)};
            items.items = returnDevys
            console.log(itemCount);
            return res.json(items), paginations;
        });
    }
    function options(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        return res.send(200);
    }    

    function pagi(req, res, next) {
        Devy.find(query, ({limit = req.query.limit, offset = req.query.offset}) => {
            const itemCount = res.count;
            const pageCount = Math.ceil(res.count / limit);
            const pagination = {pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)};
            return pagination;
        });
        return res.send(pagination);
    }

    return {post, get, options, pagi};
}

module.exports = devysController;