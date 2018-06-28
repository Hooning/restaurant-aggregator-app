const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number
  },
  telephoneNumber: String,
  url: String,
  img: String,
  lastUpdateDate: { 
    type: Date, 
    default: Date.now 
  }

});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
