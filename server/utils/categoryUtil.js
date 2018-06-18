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
    } ,

    reconvertCategories : (category) => {
        if(category == constants.APPETIZER){
            return "appetizer starter"
        }
        if(category == constants.SALAD){
            return "salad green"
        }
        if(category == constants.PASTA){
            return "pasta spaghetti"
        }
        if(category == constants.PIZZA){
            return "pizza pizzeria"
        }
        if(category == constants.DESSERT){
            return "dessert dolci gelato"
        }
        if(category == constants.SANDWICH){
            return "sandwich burger"
        }
        if(category == constants.MAIN_COURSE){
            return "entree main"
        }
        return "appetizer starter salad green pasta spaghetti pizza pizzeria dessert dolci gelato sandwich burger entree main";

    }
}