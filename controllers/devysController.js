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
            const returnDevys = devy.map((devy) => {
                const newDevy = devy.toJSON();
                newDevy.links = {};
                newDevy.links.self = `http://${req.headers.host}/api/devy/${devy._id}`;
                newDevy.links.collection = `http://${req.headers.host}/api/devy/`;
                return newDevy;
            });
            return res.json(returnDevys);
        });
    }
    function options(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.send(200);
    }    
    return {post, get, options};
}

module.exports = devysController;