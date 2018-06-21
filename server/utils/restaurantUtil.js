const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

module.exports = {
    
    getAllRestaurants : () => {
        console.log('## getAllRestaurants ##')

        return new Promise((resolve, reject) => {
            resolve(Restaurant.find().exec());
        })
    },

    getRestaurantId: (string) =>{
        let query = {
            'name': string
        }
        return Restaurant.findOne(query).exec();
        // return new Promise ((resolve, reject) => {
        //     resolve (Restaurant.findOne(query).exec()); 
        // });
    },


}
