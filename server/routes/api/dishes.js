const dishUtil = require('../../utils/dishUtil.js');
const crawler = require('../../crawler/crawler.js');
// express-validator (validation)
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var pizzeriailficoURI = 'http://www.pizzeriailfico.com/menu/';
var maccheronirepublicURI = 'http://www.maccheronirepublic.com/menu.html';
var cheeboURI = 'https://docs.wixstatic.com/ugd/4875de_caecf0487c5143e09a57202d2b4376ec.pdf';

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
    // crawler.htmlCrawler();
    crawler.htmlCrawler.queue(pizzeriailficoURI);
    crawler.htmlCrawler.queue(maccheronirepublicURI);
    // console.log(crawler.htmlCrawler.log);

    //console.log(crawler.htmlCrawler);
    
    
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
