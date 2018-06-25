const dishUtil = require('../../utils/dishUtil.js');
const restaurantUtil = require('../../utils/restaurantUtil.js');
const constants = require('../../utils/constants.js');
const crawler = require('../../crawler/crawler.js');
// express-validator (validation)
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = (app) => {
  app.get('/api/dishes/', (req, res, next) => {
    console.log(req.query.searchString);

    dishUtil.searchDishes(req.query.searchString)      
      .then((data) => { 
        return res.json(data); 
      }).catch((err) => next(err));
  });

  app.post('/api/dishes', function (req, res, next) {
    dishUtil.insertDishes(req.body)
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });

  app.post('/api/crawlDishes', function (req, res, next) {

    restaurantUtil.getAllRestaurants().then((restaurants)=>{
      restaurants.forEach((restaurant) => {
        // let expire = 
        if( Date.now() - restaurant.lastUpdateDate > 24*3600*1000){
          //do something;
        }
      })
    });
// item.expires = new Date(Date.now() + 24*3600*1000);

    crawler.htmlCrawler.queue(constants.URI.pizzeriailficoURI);
    crawler.htmlCrawler.queue(constants.URI.maccheronirepublicURI);
    
    crawler.pdfCrawler.queue({
      uri: constants.URI.cheeboURI,
      filename: "./files/cheebo.pdf"});

    // dishUtil.insertDishes(req.body)
    //   .then((data) => { return res.json(data); })
    //   .catch((err) => next(err));
  });
  
  app.delete('/api/dishes/:id', function (req, res, next) {
    dishUtil.deleteDish({ "_id": req.params.id })
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });


};
