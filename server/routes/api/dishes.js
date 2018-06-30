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
    //console.log(req.query.searchString);

    dishUtil.searchDishes(req.query.searchString)      
      .then((data) => { 
        return res.json(data); 
      }).catch((err) => next(err));
  });

  app.post('/api/dishes', function (req, res, next) {
    console.log(req.body);
    
    let id = req.body.restaurant;

    dishUtil.upsertDishes(req.body, )
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });

  app.post('/api/crawlDishes', function (req, res, next) {

    restaurantUtil.getAllRestaurants().then((restaurants)=>{
      let updatedRestaurant = [];

      for(let i=0; i< restaurants.length; i++){
        if( Date.now() - restaurants[i].lastUpdateDate > 24*3600*1000){
          restaurants[i].set({'lastUpdateDate': Date.now()});
          restaurants[i].save()
          .then((restaurant)=> {
            if(restaurantUtil.checkPdfFile(restaurant.url)){
              crawler.pdfCrawler.queue({
                uri: restaurant.url,
                filename: "cheebo.pdf"});
            }else{              
              crawler.htmlCrawler.queue(restaurant.url);                  
            }
          })
          .catch(err => next(err));
        }else{
          let timeleft = Date.now() - restaurants[i].lastUpdateDate;
          res.status(400);
          return res.json({
            'timeleft':timeleft,
            'resultMessage':'Time left, Can not execute crawler.'
          });
        }
      }

      res.status(200);
      return res.json({'resultMessage':'Crawler Successfully executed.'});
  
    });

  });
  
  app.delete('/api/dishes/:id', function (req, res, next) {
    dishUtil.deleteDish({ "_id": req.params.id })
      .then((data) => {
        if( data.ok == 1 && data.n == 1){
          res.status(200);
          data['resultMessage'] = 'Selected dish has successfully deleted';
        }else{
          res.status(404);
          data['resultMessage'] = 'Selected dish is already deleted';
        }
        return res.json(data); 
      })
      .catch((err) => next(err));
  });


};
