var Crawler = require("crawler");
let fs = require('fs');
const cheerio = require('cheerio');
var async = require("async");
PDFParser = require("pdf2json");
const dishUtil = require('../utils/dishUtil.js');
const restaurantUtil = require('../utils/restaurantUtil.js');
var constants = require('../utils/constants');
var convertCategories = require('../utils/categoryUtil.js').convertCategories;


var pizzeriailficoURI = 'http://www.pizzeriailfico.com/menu/';
var maccheronirepublicURI = 'http://www.maccheronirepublic.com/menu.html';
var cheeboURI = 'https://docs.wixstatic.com/ugd/4875de_caecf0487c5143e09a57202d2b4376ec.pdf';

var htmlCrawler = new Crawler({
  maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
      if(error){
        console.log(error);
      }else{
        var $ = res.$;
        // console.log(res.options.uri);
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      if(res.options.uri == pizzeriailficoURI) { 
        restaurantUtil.getRestaurantId(constants.RESTAURANT.pizzeriailfico)
          .then((data)=> {
            dishUtil.upsertDishes(pizzeriailfico($), data._id)
          });        
        
      }else if (res.options.uri == maccheronirepublicURI) {
        restaurantUtil.getRestaurantId(constants.RESTAURANT.maccheronirepublic)
        .then((data)=> {
          dishUtil.upsertDishes(maccheronirepublic($), data._id)
        });        
      }
    }
    // return new Promise ((r, r2) => r(done));
    done();
  }
});

var pdfCrawler = new Crawler({
  encoding:null,
  jQuery:false,// set false to suppress warning message.
  callback:function(err, res, done){
    if(err){
        console.error(err.stack);
    }else{
        fs.createWriteStream(res.options.filename).write(res.body);
    }
    done();
  }
});

function pizzeriailfico($){
  // fs.writeFile("./pizzeriailfico.html",  $(".entry_content").find('.span8'));
  // var body = $(res.body);
  let fullMenu = {};
  let partialMenu = $(".entry_content").find('.span8');
  let finalMenu = [];
  for (let i = 0; i < partialMenu.length; i++) {
    let categoryName = $(partialMenu[i]).find('.zmt').text();
    if(!(categoryName in fullMenu)){
        fullMenu[categoryName] = [];
    }
    
    let liTags = $(partialMenu[i]).find('li');
    for (let j = 0; j < liTags.length; j++) {
      let dishedName = $(liTags[j]).find('i');
      let ingredients = $(liTags[j]).text().replace(/\s\s+/g, ' ');
      let price = parseSentenceForNumber(ingredients);
      let currency = checkCurrencySymbol(price) ? constants.EURO : constants.DOLLAR;
      ingredients = ingredients.trim().slice(0, price.length *-1).trim();
      

      
      if(dishedName[0]){
         fullMenu[categoryName].push({
          'name': $(liTags[j]).find('i').text(),
          'ingredients': ingredients,
          'categories': convertCategories(categoryName),
          'price' : {'currency': currency, 'value': price},
        })
      }
    }
  }
  for (let key in fullMenu) {
    fullMenu[key].forEach(function(dish) {
      finalMenu.push(dish);
    });
  }

  return finalMenu;
  // return new Promise(function(resolve, reject) {
  //   // resolve (fullMenu);
  //   fs.writeFile("./pizzeriailfico.json", JSON.stringify(finalMenu), function(err){
  //     if (err) reject(err);
  //     else resolve(finalMenu);
  //   });
  // });
}

function maccheronirepublic($){
  // fs.writeFile("./maccheronirepublic.html", $(".menu"));

  let fullMenu = {};
  let Categories = $(".menu").find('.header-menu-inner');
  let partialMenu = $(".menu");
  let finalMenu = [];

  for(let i=0; i< partialMenu.find('.list-unstyled-variant-1').length; i++){
    let categoryName = $(Categories[i]).text().replace(/\s\s+/g, ' ').trim();
    if(!(categoryName in fullMenu) && categoryName != ""){
      fullMenu[categoryName] = [];
    }
    let liTags = $(partialMenu[i]).find('li');
    for (let j = 0; j < liTags.length; j++) {
      let dishedInfo = $(liTags[j]).find('p');
      let name, price, ingredients;
      if(dishedInfo[0]){
        name = $($(dishedInfo[0]).find('.text-white')[0]).text().replace(/\s\s+/g, ' ').trim();
        price = $($(dishedInfo[0]).find('.text-white')[1]).text().replace(/\s\s+/g, ' ').trim();
      }
      if(dishedInfo[1]){
        ingredients = $(dishedInfo[1]).text();
      }
      let currency = checkCurrencySymbol(price) ? constants.EURO : constants.DOLLAR;
      price = price.slice(1, price.length);
     
      if(name!= ""){
        fullMenu[categoryName].push({
          'name': name,
          'ingredients': ingredients,
          'categories' : convertCategories(categoryName),
          'price' : {'currency': currency, 'value': price}
        })
      }
    }
  }
  
  for (let key in fullMenu) {
    fullMenu[key].forEach(function(dish) {
      finalMenu.push(dish);
    });
  }

  return finalMenu;
  // return new Promise(function(resolve, reject) {
    // resolve(fullMenu);
    // fs.writeFile("./maccheronirepublic.json", JSON.stringify(fullMenu), function(err){
    //   if (err) reject(err);
    //   else resolve(JSON.stringify(fullMenu));
    // });
  // });
}


function parseSentenceForNumber(sentence){
  var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
  return matches && matches[0] || null;
}

function checkCurrencySymbol(text){
  var isDollar = /[€]/.test(text.trim());
  // var isEuro = /[€]/.test(text.trim());
  return isDollar;
}

// htmlCrawler.queue(pizzeriailficoURI);
// htmlCrawler.queue(maccheronirepublicURI);

async.series([
  function(done) {
    pdfCrawler.queue({
      uri:cheeboURI,
      filename: "cheebo.pdf"
    });
    done();
  },
  function(done) {
    // pdfParser.loadPDF("./cheebo.pdf");
    done();
  }
]);

module.exports = {
  htmlCrawler: htmlCrawler
}