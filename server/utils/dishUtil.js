const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

module.exports = {
    
    searchDishes : (query) => {
        return new Promise((resolve, reject) => {
            console.log('# searchDishes query: ' + JSON.stringify(query));
            resolve(Dish.find(query).populate('restaurant').exec());
        })
    },

    insertDishes: (json, id) => {
        // validation
        if(id && !Array.isArray(json)){
            json.restaurant = id;
        }
        if(Array.isArray(json)){
            json.forEach((dish) => {
                if(id){
                    dish.restaurant = id;                    
                }
            })
        }
        // main
        return new Promise((resolve, rejected) => {
            var DishSchema = require('mongoose').model('Dish').schema;
            const Dish = mongoose.model('Dish', DishSchema);
            var dishes = json;
            resolve(Dish.collection.insert(dishes, onInsert));
            function onInsert(err, docs) {
                if (err) {
                    // TODO: handle error
                    rejected(console.log('# Error occured during insert : ' + err));
                } else {
                    if( Array.isArray(json) ){
                        console.info('%d dishes were successfully stored.', json.length);
                    }else{
                        console.info('One dish was successfully stored.');
                    }
                }
            }
        });
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

    deleteDish: (json) => {
        return new Promise((resolve, reject) => {
            console.log('deleteDish : ' + JSON.stringify(json));
            resolve(Dish.deleteOne(json).exec());
        });
    },


}
