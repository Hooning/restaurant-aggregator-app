const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const categoryUtil = require('./categoryUtil');


removeAllSymbolFromString = (str) => {
  return str.replace(/[^a-zA-Z ]/g, "");
}

getExcludeRegex = (str) => {
  return "^((?!"+str +").)*$";
}

getQueryFromString = (searchString, recordName) => {
  let queryPath = {};
  query[recordName] = '/'+searchString+'/i';
}

normalSearchUseDescription = (searchString, foodType, withoutFragments) => {
  if(!searchString){
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType, withoutFragments);
    }
    return getAllDishes();
  }
  if(searchString.trim() == ""){
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType, withoutFragments);
    }
    return getAllDishes();
  }

  // mongodb query use lookup
  // db.dishes.aggregate(
  //  [{ $project: { 
  //       description: { $concat: [ "$name", " ", "$ingredients" ] }, 
  //       categories: "$categories",
  //       inventory_docs: "$inventory_docs"
  //     } },
  //     {$match:{
  //     $and: [
  //         {$or: [
  //             {'description': {'$regex': ".*Prosciutto.*", $options: 'i'}},
  //             {'description': {'$regex': ".*basil.*", $options: 'i'}},
  //             {'description': {'$regex': ".*TRIPPA.*", $options: 'i'}}
  //         ]},
  //         {'description': {'$regex': "^((?!basil).)*$", $options: 'i'}},
  //         {'categories': 'Pasta'}
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
    foodType = categoryUtil.convertCategories(searchString);
    query[1]['$project']['description']['$concat'][4] = categoryUtil.reconvertCategories(foodType);     
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
  if(withoutFragments.length >0){
    withoutFragments.forEach((wfragment) => {
      ++queryIndex;
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = getExcludeRegex(wfragment.trim());
      newFilterForDescription['description']['$options'] = "i";
      query[2]['$match']['$and'][queryIndex] = newFilterForDescription;
    })
  }

  return new Promise ((resolve, reject) => {
    resolve(Dish.aggregate(query).exec());
  });
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
  let preciseSearchFragments = [];
  let foodType = "";
  let withoutFragments = [];

  if(searchString.includes('type:')){
    let typeFragments = searchString.trim().split(" ");
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

  if(searchString.includes('without:') || searchString.includes('--')){
    let index = searchString.includes('without:') ? searchString.indexOf('without:') : searchString.indexOf('--');
    let withoutString = searchString.substring(index, searchString.length).trim();
    searchString = searchString.slice(0, index).trim();
    let startStringIndex = 8;
    if(withoutString[0] == '-'){
      startStringIndex = 2;
    }
    withoutString = withoutString.slice(startStringIndex, withoutString.length).trim();
    let tmpWithoutFragments = withoutString.trim().split(" ");
    for(let i = 0; i < tmpWithoutFragments.length; i++) {
      if(tmpWithoutFragments[i].trim() != ''){
        let tmp = tmpWithoutFragments[i];
        tmp = tmp.replace(/[^a-zA-Z" ]/g, "");
        withoutFragments.push(tmp);
      }
    }
  }

  searchString = searchString.replace(/[^a-zA-Z" ]/g, "");

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
      preciseSearchFragments.push(smallString.trim());
    })

    return new Promise ((resolve, reject)=> {
     resolve(preciseSearch(preciseSearchFragments, foodType, searchString, withoutFragments));
    })
  }else{
    return new Promise ((resolve, reject)=> {
     resolve(normalSearchUseDescription(searchString, foodType, withoutFragments));
    })
    
  }
  
  // if(searchType === 'preciseSearch'){
  //   preciseSearch();
  // }
}

preciseSearch = (preciseFragments, foodType, searchString, withoutFragments) => {
  if(preciseFragments.length == 0){
    if(searchString){
      return normalSearchUseDescription(searchString, foodType, withoutFragments);
    }
    if(foodType){
     return getAllDishesOfSpecificCategory(foodType, withoutFragments);
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

  if(withoutFragments.length >0){
    withoutFragments.forEach((wfragment) => {
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = getExcludeRegex(wfragment.trim());
      newFilterForDescription['description']['$options'] = "i";
      query[2]['$match']['$or'][0]['$and'].push(newFilterForDescription);
    })
  }

  if(searchString){
    let searchFragments = searchString.trim().split(" ");
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

getAllDishesOfSpecificCategory = (category, withoutFragments) => {
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
  query[1]['$project']['description']['$concat'][3] = ' ' + category;
  query[1]['$project']['name'] = '$name';
  query[1]['$project']['price'] = '$price';
  query[1]['$project']['ingredients'] = '$ingredients';
  query[1]['$project']['categories'] = '$categories';
  query[1]['$project']['restaurant'] = '$restaurant';

  let queryIndex = 0;
  query[2] = {};
  query[2]['$match'] = {};
  query[2]['$match']['$and'] = []; 

  if(category){
    let newFilterForCategory = {};
    newFilterForCategory['categories'] = category;
    query[2]['$match']['$and'][queryIndex] = newFilterForCategory;
  }

  if(withoutFragments.length > 0){
    withoutFragments.forEach((wfragment) => {
      ++queryIndex;
      let newFilterForDescription = {};
      newFilterForDescription['description'] = {};
      newFilterForDescription['description']['$regex'] = getExcludeRegex(wfragment.trim());
      newFilterForDescription['description']['$options'] = "i";
      query[2]['$match']['$and'][queryIndex] = newFilterForDescription;
    })
  }
  // console.log(JSON.stringify(query));

  return new Promise ((resolve, reject) => {
    resolve(Dish.aggregate(query).exec());
  });
}

module.exports = {

  searchDishes : (query) => {
    return new Promise ((resolve, reject)=> {
     resolve(classifySearch(query));
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
