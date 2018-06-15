const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

removeAllSymbolFromString = (str) => {
  return str.replace(/[^a-zA-Z ]/g, "");
}

getQueryFromString = (searchString, recordName) => {
  let queryPath = {};
  query[recordName] = '/'+searchString+'/i';
}

normalSearch = (searchString) => {
//find with regex:
// db.dishes.find({'name': {$regex: ".*pan.*", $options: 'i'}});

//  db.dishes.find({
//     $or: [
//         {$or: [
//             {'name': {'$regex': ".*antipasto.*", $options: 'i'}},
//             {'name': {'$regex': ".*BRUSCHETTA .*", $options: 'i'}},
//         ]}
//     ]
// })
// console.log(searchString);
  if(!searchString){
    return getAllDishes();
  }
  let query = {};
  query['$or'] = [];                   // {$or: [
    
  query['$or'][0] = {};
  query['$or'][0]['$or'] = [];         //   {$or: [
  // query['$or'][0]['$or'][0] = {};      // {}, ]},
  query['$or'][1] = {};                // {$or: [
  query['$or'][1]['$or'] = [];
  // query['$or'][1]['$or'][0] = {};      //   {}, ]}

  // ANTIPASTO bruschetta => 
  var fragments = searchString.trim().split(" ");
  fragments.forEach((fragment) => {
    let newFilterForName = {};
    newFilterForName['name'] = {};
    newFilterForName['name']['$regex'] = ".*" + fragment + ".*";
    newFilterForName['name']['$options'] = "i";
    query['$or'][0]['$or'].push(newFilterForName);

    let newFilterForIngredients = {};
    newFilterForIngredients['name'] = {};
    newFilterForIngredients['name']['$regex'] = ".*" + fragment + ".*";
    newFilterForIngredients['name']['$options'] = "i";
    query['$or'][1]['$or'].push(newFilterForIngredients);
  });
  // console.log(JSON.stringify(query));

  return new Promise ((resolve, reject) => {
    // resolve(query);
    resolve (Dish.find(query).exec());
  });
};

getAllDishes = () =>{
return new Promise ((resolve, reject)=> {
 resolve(Dish.find().populate('restaurant').exec());
})
}

module.exports = {

searchDishes : (query) => {
  return new Promise((resolve, reject) => {
    // console.log('# searchDishes query: ' + JSON.stringify(query));
    // resolve(Dish.find().populate('restaurant').exec());
    resolve(normalSearch(query));
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
