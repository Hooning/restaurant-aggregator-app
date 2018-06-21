const restaurantUtil = require('../../utils/restaurantUtil.js');

module.exports = (app) => {
    app.get('/api/restaurants/', (req, res, next) => {
        console.log("## app.get('/api/restaurants/' ##")
        restaurantUtil.getAllRestaurants()      
        .then((data) => { return res.json(data); })
        .catch((err) => next(err));
    });
}