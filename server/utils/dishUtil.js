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
  let queryMaxIndex = 0; 
  query['$or'] = []; 

  query['$or'][queryMaxIndex] = {};
  query['$or'][queryMaxIndex]['$or'] = []; 
  queryMaxIndex++;
  query['$or'][queryMaxIndex] = {};      
  query['$or'][queryMaxIndex]['$or'] = [];
  queryMaxIndex++;

  // Prosciutto  basil  TRIPPA => 4
  var fragments = searchString.trim().split(" ");
  fragments.forEach((fragment) => {
    if(fragment.trim()){
      let newFilterForName = {};
      newFilterForName['name'] = {};
      newFilterForName['name']['$regex'] = ".*" + fragment + ".*";
      newFilterForName['name']['$options'] = "i";
      query['$or'][0]['$or'].push(newFilterForName);

      let newFilterForIngredients = {};
      newFilterForIngredients['ingredients'] = {};
      newFilterForIngredients['ingredients']['$regex'] = ".*" + fragment + ".*";
      newFilterForIngredients['ingredients']['$options'] = "i";
      query['$or'][1]['$or'].push(newFilterForIngredients);
    }
  });

  return new Promise ((resolve, reject)=> {
   resolve(Dish.find(query).populate('restaurant').exec());
  })
};

normalSearchUseDescription = (searchString) => {
  if(!searchString){
    return getAllDishes();
  }
  // db.dishes.aggregate(
  //  [
  //     { $project: { description: { $concat: [ "$name", " ", "$ingredients" ] } } },
  //     {$match:{
  //     $or: [
  //         {$or: [
  //             {'description': {'$regex': ".*Prosciutto.*", $options: 'i'}},
  //             {'description': {'$regex': ".*basil.*", $options: 'i'}},
  //             {'description': {'$regex': ".*TRIPPA.*", $options: 'i'}}
  //         ]}
  //     ]}}
  //  ]
  // )

  let query = [];
  let queryMaxIndex = 0; 
  query[0] = {}; 
  query[0]['$project'] = {};
  query[0]['$project']['description'] = {};
  query[0]['$project']['description']['$concat'] = [];
  query[0]['$project']['description']['$concat'][0] = '$name' ;
  query[0]['$project']['description']['$concat'][1] = " ";
  query[0]['$project']['description']['$concat'][2] = '$ingredients';

  query[1] = {};
  query[1]['$match'] = {};
  query[1]['$match']['$or'] = [];
  query[1]['$match']['$or'][0] = {};
  query[1]['$match']['$or'][0]['$or'] = [];

  // ANTIPASTO bruschetta => 
  var fragments = searchString.trim().split(" ");
  fragments.forEach((fragment) => {
    if(fragment.trim()){
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = ".*" + fragment + ".*";
      newFilterForDescription['description']['$options'] = "i";
      query[1]['$match']['$or'][0]['$or'].push(newFilterForDescription);
    }
  });
  let idArray = [];
  return new Promise((resolve, rejected) => {
    Dish.aggregate(query).exec().then((dishes)=> {
    dishes.forEach((dish)=>{
      idArray.push(dish._id);
    });
    let newQuery = {};
    newQuery['_id'] = {};
    newQuery['_id']['$in'] = idArray;
      resolve(Dish.find(newQuery).populate('restaurant').exec());
    }) 
  })
  
 
}

classifySearch = (searchString) => {
  if(!searchString.trim()){
    return getAllDishes();
  }
  let searchType = "";
  let preciseSearchString = [];
  let fragments = [];
  if(searchString.includes('without')){
    console.log(searchString.includes('without'));
  }
  if(!searchString.includes('without')){
    if(searchString.includes('"')){
      let indices = [];
      for(let i = 0; i < searchString.length; i++) {
        if (searchString[i] === '"') indices.push(i);
      }
      for(let i = 0; i < indices.length; i++) {
        if(indices[i+1]){
          let subString = searchString.substring(indices[i]+1, indices[i+1]);
          ++i;
          preciseSearchString.push(subString);
        }
      }
      preciseSearchString.forEach((smallString)=> {
        let fragment = smallString.trim().split(" ");
        fragment.forEach((smallFragment) => {
          fragments.push(smallFragment);
        });
      })
      preciseSearch(fragments);
    }else{
      normalSearch(searchString);
    }
  }
  // if(searchType === 'preciseSearch'){
  //   preciseSearch();
  // }
}

preciseSearch = (fragments) => {
  if(!searchString){
    return getAllDishes();
  }
  let query = {};

  query['$or'] = [];           
  query['$or'][queryMaxIndex] = {};
  query['$or'][queryMaxIndex]['$or'] = [];
  queryMaxIndex++;
  query['$or'][queryMaxIndex] = {};    
  query['$or'][queryMaxIndex]['$or'] = [];
  queryMaxIndex++;

  // ANTIPASTO bruschetta => 
  // let fragments = searchString.trim().split(" ");
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

  return new Promise ((resolve, reject) => {
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
  return new Promise ((resolve, reject)=> {
   resolve(normalSearchUseDescription(query));
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
