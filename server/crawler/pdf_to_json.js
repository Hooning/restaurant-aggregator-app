let fs = require('fs');
var async = require("async");
PDFParser = require("pdf2json");
var constants = require('../utils/constants');

// let pdfParser = new PDFParser();

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
// fs.writeFile("./menu.json",  JSON.stringify(pdfData));
//   fs.writeFile("./cheebo.json",  minimizeCheebo(pdfData));
// });


function minimizeCheebo(pdfData){
  var pages = pdfData["formImage"]["Pages"];
  var categories = [];
  let pageNo = -1;
  let boundsOfPages = [];
  let allTexts = [];
  let allDataInEachCategory = {};
  //????????????????????????????? this pdf file is so stupid

  //first, classify all categories, and get attributes of each category
  pages.forEach((page) => {
    pageNo++;
    //get all Categories
    page.Texts.forEach((text) => {
        if(text.R[0].TS){
          let textSize = parseFloat(text.R[0].TS[1]);
          if(textSize > 12 && textSize < 20 ){
            let newCategory = {};
            // newCategory.x = text.x;
            newCategory.y = text.y;
            newCategory['text'] = decodeURI(text.R[0].T);
            newCategory.page = pageNo;
            categories.push(newCategory);
          }
        }
    });
  });

  //get first and last bound of each pages base on categories on each pages
  categories.forEach((category) => {
    if(!boundsOfPages[category.page]){
      boundsOfPages[category.page] = {'min':-1,'max':-1};
    }
    let max = boundsOfPages[category.page].max;
    let min = boundsOfPages[category.page].min;
    boundsOfPages[category.page].max = category.y > max ? category.y : max;
    boundsOfPages[category.page].min = min < 0 ? category.y : (min < category.y ? min : category.y);
  })

  // remove all unecessary text (part 1)
  for(let i = 0; i < pages.length; i++){
    pages[i].Texts.forEach((text) => {
      if(text.y > boundsOfPages[i].min){
        if(!allTexts[i]) 
          allTexts[i] =[];
        allTexts[i].push(text);
      }
    });
  }

  //determine area for each Category
  var sortArray = [];
  for(let i = 0; i < categories.length; i++){
  	if(!sortArray[categories[i].page]){
  		sortArray[categories[i].page] = [];
  	}
  	sortArray[categories[i].page].push(categories[i].y);
  	sortArray[categories[i].page].sort(function(a, b){return a - b});
  }

  //add bound to each Category
  var maximumLengthOfPage = 10000;
  for (let i = 0; i < categories.length; i++) {
  	let arrayOfCategory = sortArray[categories[i].page];
  	let index = arrayOfCategory.indexOf(categories[i].y);
  	categories[i].max = !arrayOfCategory[index+1] ? maximumLengthOfPage : arrayOfCategory[index+1];  	
  }

  // classify data in category  (continue)
  for (let i = 0; i < allTexts.length; i++) {
  	allTexts[i].forEach(function(dataByLine){
			for (let j = 0; j < categories.length; j++) {
	  		if(!allDataInEachCategory[categories[j].text]){
	  			allDataInEachCategory[categories[j].text] = [];
	  		}
	  		if(i == categories[j].page){
	  			if(dataByLine.y > categories[j].y && dataByLine.y < categories[j].max){
	  				allDataInEachCategory[categories[j].text].push(dataByLine);
	  			}
	  		}
			}			
  	});
  }

  //format all data, remove unecessary data
  for (let i = 0; i < categories.length; i++) {
  	if(categories[i].text.includes("Sides 6")){
  		delete allDataInEachCategory[categories[i].text];
  		categories.splice(i,1);
  		break;
  	}
  }

  //add category for each dish, add price and currency

  categories.forEach(function(category){
	 		minimizeData(allDataInEachCategory[category.text], category.text);
  });

	let finalMenu = [];
  categories.forEach(function(category){
  	allDataInEachCategory[category.text].forEach((dish) => {
  		dish['categories'] = category.text;

  		let tmp = dish['price'];
  		let currency = checkCurrencySymbol(tmp.toString()) ? constants.EURO : constants.DOLLAR;
  		dish['price'] = {'currency': currency, 'value': tmp};
  		if(!dish['ingredients']){
  			dish['ingredients'] = 'none';
  		}

  		finalMenu.push(dish);
  	})
  });

  return finalMenu;
}

function minimizeData(fullData, categoryType){
	let numberOfData = fullData.length;
	for (let i = 0; i < numberOfData; i++) {
		let smallData = fullData[i];
		delete smallData['oc'];
		delete smallData['y'];
		delete smallData['w'];
		delete smallData['x'];
		delete smallData['sw'];
		delete smallData['clr'];
		delete smallData['A'];
		if(smallData['R']){
			//add new element "Text" for all Texts
			smallData['Text'] = decodeURI(smallData['R'][0]['T']);
			smallData['Text'] = smallData['Text'].replace(/%2C/g, ",").replace(/%26/g, "&").trim();
			smallData['Text'] = smallData['Text'].replace( /%2B/g, '+' );
			if(parseFloat(smallData['R'][0]['TS'][1]) < 11.3){
 				//remove some contents
 				fullData.splice(i,1);

				numberOfData--;
				i--;
 			}
			// if(smallData['R'][0].TS[1]<)
			delete smallData['R'];
		}
	}
	//remove price value in text, add new price variable in current object
	if(!parseSentenceForNumber(categoryType)){
		numberOfData = fullData.length;
		for (let i = 0; i < numberOfData; i++) {
			let smallData = fullData[i];
			if(parseSentenceForNumber(smallData['Text'])){
				let price = smallData['Text'].substring(smallData['Text'].length - 2); 
				if(checkIfStringContainOnlyNumber(price) && parseFloat(price.trim()) >6){
					smallData['price'] = parseFloat(price.trim());
					smallData['Text'] = smallData['Text'].slice(0, price.length*-1).trim();
				}
			}
		}
	
		//add ingredient
		for (let i = fullData.length-1; i >=1 ; i--) {
	 		//rewrite json again
	 		let currentData = fullData[i];
	 		let previousData = fullData[i-1];
	 		if(!previousData['price'] && !currentData['price']){
	 			//merge Text
	 			previousData['Text'] += previousData['Text'].length ==1 ? currentData['Text']: " " +currentData['Text'];
	 			fullData.splice(i,1);
	 		}else if (previousData['price'] && !currentData['price']){
	 			//add ingredients
				previousData['ingredients'] = currentData['Text'];
	 			fullData.splice(i,1);
	 		}
		}

		for(let i=0; i< fullData.length; i++){
			let smallData = fullData[i];
			smallData['name'] = smallData['Text'];
			delete smallData['Text'];
		}
	}else if(!categoryType.includes("Sides")){
		numberOfData = fullData.length;
		//Eliminate all excess data 
		for (let i = 0; i < numberOfData; i++) {
			let smallData = fullData[i];
			if(smallData['Text'].trim().includes("Extra toppings")){
				fullData.splice(i);
				break;
			}
		}

		//Merge text and add ingredients
		for (let i = fullData.length-1; i >=1 ; i--) {
			let currentData = fullData[i];
	 		let previousData = fullData[i-1];
			if(parseSentenceForNumber(previousData['Text']) && !parseSentenceForNumber(currentData['Text'])){
				previousData['ingredients'] = currentData['Text'];
				fullData.splice(i,1);
			}else if (!parseSentenceForNumber(previousData['Text']) && !parseSentenceForNumber(currentData['Text'])){
				previousData['Text'] += currentData['Text'];
				fullData.splice(i,1);
			}
		}

		numberOfData = fullData.length
		for (let i = 0; i < numberOfData++ ; i+= 2) {
			currentData = fullData[i];
			duplicatedData = Object.assign({}, currentData);
			let tmp = currentData['Text'];
			currentData['Text'] = tmp.substring(0, tmp.length - 8)
				+ " 1ft " + tmp.substring(tmp.length - 7, tmp.length -5);
			tmp = duplicatedData['Text'];
			duplicatedData['Text'] = tmp.substring(0, tmp.length - 8)
				+ " 3ft " + tmp.substring(tmp.length - 2, tmp.length);
			fullData.splice(i,0, duplicatedData);

		}

		numberOfData = fullData.length
		for (let i = 0; i < numberOfData; i++) {
			let smallData = fullData[i];
			if(parseSentenceForNumber(smallData['Text'])){
				let price = smallData['Text'].substring(smallData['Text'].length - 2); 
				if(checkIfStringContainOnlyNumber(price)){
					smallData['price'] = parseFloat(price.trim());
					smallData['Text'] = smallData['Text'].slice(0, price.length*-1).trim();
				}
			}
			smallData['name'] = smallData['Text'];
			delete smallData['Text'];
		}
	}

	return fullData;
}

function parseSentenceForNumber(sentence){
  var matches = sentence.match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
  return matches && matches[0] || null;
}

function checkIfStringContainOnlyNumber(text){
	var isnum = /^\d+$/.test(text.trim());
	return isnum;
}

function checkCurrencySymbol(text){
  var isDollar = /[€]/.test(text.trim());
  return isDollar;
}

// pdfParser.loadPDF("./cheebo.pdf");

module.exports = {
  minimizeCheebo: minimizeCheebo,
  parseSentenceForNumber: parseSentenceForNumber,
  checkIfStringContainOnlyNumber: checkIfStringContainOnlyNumber
}