const mongoose = require('mongoose');
var category = require('../utils/constants');

const DishSchema = new mongoose.Schema({
  name: String,
  price: { currency: String, value: Number, },
  ingredients: String,
  categories: {
      type: String, 
      enum: [
          category.APPETIZER,
          category.SALAD,
          category.PIZZA,
          category.PASTA,
          category.SANDWICH,
          category.MAIN_COURSE,
          category.DESSERT,
      ], 
     default: category.MAIN_COURSE
  },
  restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},

});

module.exports = mongoose.model('Dish', DishSchema);
