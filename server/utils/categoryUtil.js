var constants = require('./constants');

module.exports = {
    convertCategories : (string) => {
        if (string.toLowerCase().match(/(appetizer|starter)/)) {
            return constants.APPETIZER;
        }

        if (string.toLowerCase().match(/(salad|green)/)) {
            return constants.SALAD;
        }
        
        if (string.toLowerCase().match(/(pasta|spaghetti)/)) {
            return constants.PASTA;
        }

        if (string.toLowerCase().match(/(pizza|pizzeria)/)) {
            return constants.PIZZA;
        }

        if (string.toLowerCase().match(/(dessert|dolci|gelato)/)) {
            return constants.DESSERT;
        }

        if (string.toLowerCase().match(/(entree|main)/)) {
            return constants.MAIN_COURSE;
        }

        if (string.toLowerCase().match(/(sandwich|burger)/)) {
            return constants.SANDWICH;
        }

        return null;
    } 
}