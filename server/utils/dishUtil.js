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

    upsertDishes: (json, id) => {
        // validation
        if(id && !Array.isArray(json)){
            json.restaurant = id;
        }
        if(Array.isArray(json)){
            json.forEach((dish) => {
                if(id){
                    dish.restaurant = id;                    
                }
            });
        }
        // main
        return new Promise((resolve, rejected) => {
            
            var DishSchema = require('mongoose').model('Dish').schema;
            const Dish = mongoose.model('Dish', DishSchema);
            var dishes = json;
            var upsertCnt = 0;

            const options = {
                upsert: true,
                multi: true
            }

            resolve(
            dishes.forEach((dish) => {
                var check = {
                    "name": dish.name,
                    "restaurant": dish.restaurant
                }

                Dish.collection.findOneAndUpdate(check, dish, options, onUpsert);
                upsertCnt += 1;
            }));
            
            console.info('%d dishes were successfully upserted.', upsertCnt);
            
            function onUpsert(err, docs) {
                if (err) {
                    rejected(console.log('# Error occured during upsert : ' + err));
                }
            }
        });
    },

    deleteDish: (json) => {
        return new Promise((resolve, reject) => {
            console.log('deleteDish : ' + JSON.stringify(json));
            resolve(Dish.deleteOne(json).exec());
        });
    },


}
