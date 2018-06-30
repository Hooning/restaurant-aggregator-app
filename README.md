# Restaurant Aggregator Application

This is a restaurant aggregator project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [crawler](https://www.npmjs.com/package/crawler/) and [pdf2json](https://www.npmjs.com/package/pdf2json/) for the crawler.
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```

- [MongoDB](https://www.mongodb.com/mongodb-3.6/) 3.6+


## Database setup (MongoDB)

Make sure to set `config.js` file in the `config` folder. See the example there for more details.

Basically, Set the databse configuration to <br/>
db_dev: 'mongodb://localhost:27017/restaurant_aggregator'

**DB** : *restaurant_aggregator* <br/>
**Collections** : *restaurants, dishes*

**[Important] You must have restaurant datas inserted before crawling dishes.**


Please insert restaurant data manually in Mongo shell :
<pre>
    <code>
db.restaurants.insertOne({
  "name": "Maccheroni Republic",
  "address":{
    "street": "332 S. Broadway",
    "city": "Los Angeles",
    "state": "CA",
    "zip": 90013
  },
  "telephoneNumber": "+1 (213) 346 9725",
  "url": "http://www.maccheronirepublic.com/menu.html",
  "img": "maccheroni.png",
  "lastUpdateDate": null
});

db.restaurants.insertOne({
  "name": "Pizzeria Il Fico",
  "address":{
    "street": "310 S. Robertson Blvd.",
    "city": "Los Angeles",
    "state": "CA",
    "zip": 90048
  },
  "telephoneNumber": "+1 (310) 271 3426",
  "url": "http://www.pizzeriailfico.com/menu",
  "img": "pizzeria.png",
  "lastUpdateDate": null
});

db.restaurants.insertOne({
  "name": "Cheebo",
  "address":{
    "street": "7533 Sunset Blvd",
    "city": "Los Angeles",
    "state": "CA",
    "zip": 90046
  },
  "telephoneNumber": "+1 (323) 850 7070",
  "url": "https://docs.wixstatic.com/ugd/4875de_caecf0487c5143e09a57202d2b4376ec.pdf",
  "img": "cheebo.png",
  "lastUpdateDate": null
});
    </code>
</pre>

## Running

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
