const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

module.exports = {
    
    getAllRestaurants : () => {
        return Restaurant.find().exec();
    },

    getRestaurantId: (string) =>{
        let query = {
            'name': string
        }
        return Restaurant.findOne(query).exec();

    },

    checkPdfFile : (string) => {
        return string.includes('.pdf');
    }


}
