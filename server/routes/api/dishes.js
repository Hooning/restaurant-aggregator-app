const dishUtil = require('../../utils/dishUtil.js');
// express-validator (validation)
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


module.exports = (app) => {
  app.get('/api/dishes/', (req, res, next) => {
    dishUtil.searchDishes(req.query)      
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });

  app.post('/api/dishes', function (req, res, next) {
    dishUtil.insertDishes(req.body)
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });
  
  app.delete('/api/dishes/:id', function (req, res, next) {
    dishUtil.deleteDish({ "_id": req.params.id })
      .then((data) => { return res.json(data); })
      .catch((err) => next(err));
  });


};
