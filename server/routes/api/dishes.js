const dishUtil = require('../../utils/dishUtil.js');
const restaurantUtil = require('../../utils/restaurantUtil.js');
const constants = require('../../utils/constants.js');
const crawler = require('../../crawler/crawler.js');
var async = require("async");

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
    dishUtil.upsertDishes(req.body)
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });

  app.post('/api/crawlDishes', function (req, res, next) {

    restaurantUtil.getAllRestaurants().then((restaurants)=>{
      let updatedRestaurant = [];

          for(let i=0; i< restaurants.length; i++){
            if( Date.now() - restaurants[i].lastUpdateDate > 24*3600*1000){
              restaurants[i].set({'lastUpdateDate': Date.now()});
              restaurants[i].save().then((restaurant)=> {
                if(restaurantUtil.checkPdfFile(restaurant.url)){
                  crawler.pdfCrawler.queue({
                    uri: restaurant.url,
                    filename: "cheebo.pdf"});
                }else{
                  
                  crawler.htmlCrawler.queue(restaurant.url);                  
                }
              });
              //do something;       
              restaurants[i]['status'] = true;    
              updatedRestaurant.push(restaurants[i]);            
            }else{
              restaurants[i]['status'] = false;
               updatedRestaurant.push(restaurants[i]);
            }
          }
        return res.json(updatedRestaurant);
      
    });

  });
  
  app.delete('/api/dishes/:id', function (req, res, next) {
    dishUtil.deleteDish({ "_id": req.params.id })
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });


};
