const Dish = require('../models/Dish');
const mongoose = require('mongoose');

module.exports = {
    
    searchDishes : (query) => {
        return new Promise((resolve, reject) => {
            console.log('# searchDishes query: ' + JSON.stringify(query));
            resolve(Dish.find(query).exec());
        })
    },

    insertDishes: (json) => {
        // validation

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

    deleteDish: (json) => {
        return new Promise((resolve, reject) => {
            console.log('deleteDish : ' + JSON.stringify(json));
            resolve(Dish.deleteOne(json).exec());
        });
    },


}
