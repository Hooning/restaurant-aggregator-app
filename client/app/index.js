import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

// css
import 'bootstrap/dist/css/bootstrap.css';
import './styles/styles.scss';
import './vendor/bootstrap/css/bootstrap.min.css';
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import './fonts/themify/themify-icons.css';
import './css/util.css';
import './css/main.css';

// js

// components
import App from './components/App/App';
import NotFound from './components/App/NotFound';
import Home from './components/Home/Home';
import Restaurants from './components/Restaurants/Restaurants';
import Dishes from './components/Dishes/Dishes';
import DishCrawler from './components/Crawler/DishCrawler';


render((
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/restaurants" component={Restaurants}/>
        <Route path="/dishes" component={Dishes}/>
        <Route path="/dishcrawler" component={DishCrawler}/>
        <Route component={NotFound}/>
      </Switch>
    </App>
  </Router>
), document.getElementById('app'));
