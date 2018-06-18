const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const categoryUtil = require('./categoryUtil');


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
  let fragments = searchString.trim().split(" ");
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

normalSearchUseDescription = (searchString, foodType) => {
  if(!searchString){
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType);
    }
    return getAllDishes();
  }
  if(searchString.trim() == ""){
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType);
    }
    return getAllDishes();
  }

  // mongodb query use lookup
  // db.dishes.aggregate(
  //  [{
  //     $lookup: {
  //         from: 'restaurants',
  //         localField: 'restaurant',
  //         foreignField: '_id',
  //         as: 'inventory_docs'
  //       }
  //     },{ $project: { 
  //       description: { $concat: [ "$name", " ", "$ingredients" ] }, 
  //       categ: "$categories",
  //       inventory_docs: "$inventory_docs"
  //     } },
  //     {$match:{
  //     $and: [
  //         {$or: [
  //             {'description': {'$regex': ".*Prosciutto.*", $options: 'i'}},
  //             {'description': {'$regex': ".*basil.*", $options: 'i'}},
  //             {'description': {'$regex': ".*TRIPPA.*", $options: 'i'}}
  //         ]},
  //             {'categories': 'Pasta'}
  //     ]}}
  //  ]
  // )

  let query = [];
  query[0] = {};
  query[0]['$lookup'] = {};
  query[0]['$lookup']['from'] = 'restaurants';
  query[0]['$lookup']['localField'] = 'restaurant';
  query[0]['$lookup']['foreignField'] = '_id';
  query[0]['$lookup']['as'] = 'restaurant';

  query[1] = {}; 
  query[1]['$project'] = {};
  query[1]['$project']['description'] = {};
  query[1]['$project']['description']['$concat'] = [];
  query[1]['$project']['description']['$concat'][0] = '$name' ;
  query[1]['$project']['description']['$concat'][1] = " ";
  query[1]['$project']['description']['$concat'][2] = '$ingredients';
  query[1]['$project']['description']['$concat'][3] = ' ';
  if(!foodType){
    foodType = categoryUtil.convertCategories("searchString");
    if(foodType){
        query[1]['$project']['description']['$concat'][4] = categoryUtil.reconvertCategories(foodType); 
    }
  }
  query[1]['$project']['name'] = '$name';
  query[1]['$project']['price'] = '$price';
  query[1]['$project']['ingredients'] = '$ingredients';
  query[1]['$project']['categories'] = '$categories';
  query[1]['$project']['restaurant'] = '$restaurant';

  let queryIndex = 0;
  query[2] = {};
  query[2]['$match'] = {};
  query[2]['$match']['$and'] = [];

  if(foodType){
    let newFilterForCategory = {};
    newFilterForCategory['categories'] = foodType;
    query[2]['$match']['$and'][queryIndex] = newFilterForCategory;
    queryIndex++;
  }
  
  query[2]['$match']['$and'][queryIndex] = {};
  query[2]['$match']['$and'][queryIndex]['$or'] = [];

  // ANTIPASTO bruschetta => 
  var fragments = searchString.trim().split(" ");
  fragments.forEach((fragment) => {
    if(fragment.trim()){
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = ".*" + fragment + ".*";
      newFilterForDescription['description']['$options'] = "i";
      query[2]['$match']['$and'][queryIndex]['$or'].push(newFilterForDescription);
    }
  });


  return new Promise ((resolve, reject) => {
    resolve(Dish.aggregate(query).exec());
  });
  // return new Promise((resolve, reject) => {
  //   Dish.aggregate(query).exec().then((dishes)=> {
  //   dishes.forEach((dish)=>{
  //     idArray.push(dish._id);
  //   });
  //   let newQuery = {};
  //   newQuery['_id'] = {};
  //   newQuery['_id']['$in'] = idArray;
  //     resolve(Dish.find(newQuery).populate('restaurant').exec());
  //   }) 
  // })
}

classifySearch = (searchString) => {
  if(!searchString){
    return getAllDishes();
  }
  if (!searchString.trim()){
    return getAllDishes();
  }
  let searchType = "";
  let preciseSearchString = [];
  let fragments = [];
  let foodType = "";
  if(searchString.includes('type:')){
    var typeFragments = searchString.trim().split(" ");
    for(let i = 0; i < typeFragments.length; i++) {
      if (typeFragments[i].includes('type:')){
        if(typeFragments[i].trim() === 'type:'){
          if(typeFragments[i+1]){
            foodType = categoryUtil.convertCategories(typeFragments[i+1].trim());
            let index = searchString.indexOf('type:');
            searchString = searchString.slice(0, index) + " " + searchString.slice(index + 5 + typeFragments[i+1].length);
          }
        }else{
          foodType = categoryUtil.convertCategories(typeFragments[i].trim().substring(5));     
          let index = searchString.indexOf('type:');
          searchString = searchString.slice(0, index) + " " + searchString.slice(index + typeFragments[i].length); 
        }
      }
    }
  }

  if(searchString.includes('without:')){
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
      for(let i = 0; i < preciseSearchString.length; i++) {
        searchString = searchString.replace(preciseSearchString[i], '');
      }
      searchString = searchString.replace(/[^A-Z0-9]+/ig, " ").trim();

      preciseSearchString.forEach((smallString)=> {
        // let fragment = smallString.trim().split(" ");
        // fragment.forEach((smallFragment) => {
        //   fragments.push(smallFragment);
        // });
        if(smallString.trim() != "")
        fragments.push(smallString.trim());
      })

      return new Promise ((resolve, reject)=> {
       resolve(preciseSearch(fragments, foodType, searchString));
      })
      
    }else{
      return new Promise ((resolve, reject)=> {
       resolve(normalSearchUseDescription(searchString, foodType));
      })
      
    }
  }
  // if(searchType === 'preciseSearch'){
  //   preciseSearch();
  // }
}

preciseSearch = (preciseFragments, foodType, searchString) => {
  if(preciseFragments.length == 0){
    if(searchString){
      return normalSearchUseDescription(searchString, foodType);
    }
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType);
    }
    return getAllDishes();
  }
  let query = [];
  query[0] = {};
  query[0]['$lookup'] = {};
  query[0]['$lookup']['from'] = 'restaurants';
  query[0]['$lookup']['localField'] = 'restaurant';
  query[0]['$lookup']['foreignField'] = '_id';
  query[0]['$lookup']['as'] = 'restaurant';

  query[1] = {}; 
  query[1]['$project'] = {};
  query[1]['$project']['description'] = {};
  query[1]['$project']['description']['$concat'] = [];
  query[1]['$project']['description']['$concat'][0] = '$name' ;
  query[1]['$project']['description']['$concat'][1] = " ";
  query[1]['$project']['description']['$concat'][2] = '$ingredients';
  query[1]['$project']['description']['$concat'][3] = ' ';
  query[1]['$project']['description']['$concat'][4] = categoryUtil.reconvertCategories(foodType);

  query[1]['$project']['name'] = '$name';
  query[1]['$project']['price'] = '$price';
  query[1]['$project']['ingredients'] = '$ingredients';
  query[1]['$project']['categories'] = '$categories';
  query[1]['$project']['restaurant'] = '$restaurant';

  query[2] = {};
  query[2]['$match'] = {};
  query[2]['$match']['$or'] = [];
  query[2]['$match']['$or'][0] = {};
  query[2]['$match']['$or'][0]['$and'] = [];


  if(foodType){
    let newFilterForCategory = {};
    newFilterForCategory['categories'] = foodType;
    query[2]['$match']['$or'][0]['$and'].push(newFilterForCategory);
  }


  preciseFragments.forEach((preciseFragment) => {
    if(preciseFragment.trim() != ""){
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = ".*" + preciseFragment + ".*";
      newFilterForDescription['description']['$options'] = "i";
      query[2]['$match']['$or'][0]['$and'].push(newFilterForDescription);
    }
  });

  if(searchString){
    var searchFragments = searchString.trim().split(" ");
    if(searchString.trim() != ""){
      query[2]['$match']['$or'][1] = {};
      query[2]['$match']['$or'][1]['$and'] = [];
      searchFragments.forEach((searchFragment) => {
        if(searchFragment.trim() != ""){
          let newFilterForDescription = {};
          newFilterForDescription['description'] = {};
          newFilterForDescription['description']['$regex'] = ".*" + searchFragment + ".*";
          newFilterForDescription['description']['$options'] = "i";
          query[2]['$match']['$or'][1]['$and'].push(newFilterForDescription);
        }
      });
    }
  }
  return new Promise ((resolve, reject) => {
    resolve(Dish.aggregate(query).exec());
  });
};

getAllDishes = () =>{
  return new Promise ((resolve, reject)=> {
   resolve(Dish.find().populate('restaurant').exec());
  })
}

getAllDishesOfSpecificCategory = (category) => {
  return new Promise ((resolve, reject)=> {
   resolve(Dish.find({categories: category}).populate('restaurant').exec());
  })
}

module.exports = {

searchDishes : (query) => {
  return new Promise ((resolve, reject)=> {
   resolve(classifySearch(query));
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
