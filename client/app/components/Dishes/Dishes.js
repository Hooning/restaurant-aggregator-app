import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import 'whatwg-fetch';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Table,
  Form,
  FormGroup,
  FormFeedback, 
  FormText, 
  Input,
  CustomInput,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Pagination, 
  PaginationItem, 
  PaginationLink 
} from 'reactstrap';
import validator from 'validator';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
global.jQuery = $;

import Background from '../../images/blog-06.jpg';

const divStyle = {
    width: "100%",
    height: "100%",
    minHeight: "455px",
    backgroundImage: `url( ${Background} )`,
    backgroundSize: "100%",
    backgroundRepeat: "repeat-y",
    position: "relative",
    zindex: "-1"
}

const filterTextStyle = {
  marginLeft: "8px",
  marginRight: "8px",
  width: "204px"
}

const wrapperStyle = { 
  width: "204px", 
  marginLeft: "8px",
  marginRight: "8px"
};

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Ranges = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};


class Dishes extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      dishes: [],
      filteredDishes: [],
      price: { 
        min: 5, 
        max:50
      },
      categories: {
        'Appetizer': false,
        'Salad': false,
        'Pizza': false,
        'Pasta': false,
        'Sandwich': false,
        'MainCourse': false,
        'Dessert': false
      },
      restaurants: [],
      ingredients: '',
      currentPage: 1,
      dishesPerPage: 10
    }

    this.slideStateChange = this.slideStateChange.bind(this);
    this.checkFilters = this.checkFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.checkboxToggle = this.checkboxToggle.bind(this);
    this.checkboxFilterToggle = this.checkboxFilterToggle.bind(this);
    this.filterIngredients = this.filterIngredients.bind(this);
    this.handleClickOnPage = this.handleClickOnPage.bind(this);
  }

  handleClickOnPage(event){
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  filterToggle() {
    $('#sidebar').toggleClass('active');
    
    // fade in the overlay
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  }

  slideStateChange(event) {
    let price = Object.assign({}, this.state.price);    //creating copy of object
    price.min = event[0];
    price.max = event[1];

    this.setState({price});
  }

  checkboxToggle(event){
    let checkedCategory = event.target.value;

    let categories = Object.assign({}, this.state.categories);

    if( checkedCategory == 'Appetizer'){
      categories.Appetizer = !this.state.categories.Appetizer;
    }else if( checkedCategory == 'Salad' ){
      categories.Salad = !this.state.categories.Salad;
    }else if( checkedCategory == 'Pizza' ){
      categories.Pizza = !this.state.categories.Pizza;
    }else if( checkedCategory == 'Pasta' ){
      categories.Pasta = !this.state.categories.Pasta;
    }else if( checkedCategory == 'Sandwich' ){
      categories.Sandwich = !this.state.categories.Sandwich;
    }else if( checkedCategory == 'MainCourse' ){
      categories.MainCourse = !this.state.categories.MainCourse;
    }else{
      categories.Dessert = !this.state.categories.Dessert;
    }

    this.setState({categories});
  }

  checkboxFilterToggle(event){

    let restaurants = this.state.restaurants;
    let checkedRestaurant = event.target.value;

    if(!restaurants.includes(checkedRestaurant)){
      restaurants.push(checkedRestaurant);
    }else{
      let index = restaurants.indexOf(checkedRestaurant);
      restaurants.splice(index, 1);
    }
    this.setState({restaurants});
  }

  filterIngredients(event){
  
    //let filteredDishes = this.state.dishes;
    let ingredients = Object.assign({}, this.state.ingredients);
    ingredients = event.target.value;

    this.setState({ingredients});
    // this.setState({filteredDishes,ingredients}, function(){
      
    //   let filteredDishesResult = this.state.filteredDishes;
    //   let filterString = this.state.ingredients;
    //   filteredDishesResult = filteredDishesResult.filter((dish)=>{
    //     if(dish.ingredients && filterString){
    //      return dish.ingredients.includes(filterString);
    //     }
    //     return null;
    //     }
    //   );
    //   // console.log(filteredDishesResult.length);
    // this.setState({filteredDishes:filteredDishesResult});
    // });
  }

  checkFilters(event){
    //console.log(this.ingredients);

    let filteredDishes = this.state.dishes;
    this.setState({filteredDishes}, function(){
      let restaurants = this.state.restaurants;

      var selectedCategories = [];
      var categories = this.state.categories;
      for(var category in categories) {
        if( categories[category] ){
          // MainCourse space issue..
          if( category == "MainCourse"){
            category = "Main Course"
          }
          selectedCategories.push(category);
        }      
      }

      let minPrice = this.state.price.min;
      let maxPrice = this.state.price.max;
      
      let filterString = this.state.ingredients;

      //let dishes = Object.assign({}, this.state.dishes);
      let filteredDishesResult = this.state.filteredDishes;

      filteredDishesResult = filteredDishesResult.filter(function (el) {
        let ingredientsFiltered = true;
        let priceFiltered = el.price.value >= minPrice && el.price.value <= maxPrice ;
        let restaurantFiltered = restaurants.indexOf(el.restaurant.name.trim()) > -1 ;
        let categoriesFiltered = selectedCategories.indexOf(el.categories.trim()) > -1;

        if(el.ingredients)
          ingredientsFiltered = el.ingredients.toLowerCase().includes(filterString.toLowerCase());

        if(selectedCategories.length < 1) 
          categoriesFiltered = true;

        if(restaurants.length < 1) 
          restaurantFiltered = true;

        return restaurantFiltered && categoriesFiltered && ingredientsFiltered && priceFiltered;

      });

    this.setState({filteredDishes:filteredDishesResult, currentPage: 1});
    });
  }

  resetFilters(){
    //reset categories choices
    let categoriesId = ['appetizer', 'salad', 'pizza', 'pasta', 'sandwich', 'mainCourse', 'dessert'];
    categoriesId.forEach((id)=>{
      if(document.getElementById(id))
      document.getElementById(id).checked = false;
    })

    let categories = {
        'Appetizer': false,
        'Salad': false,
        'Pizza': false,
        'Pasta': false,
        'Sandwich': false,
        'MainCourse': false,
        'Dessert': false
    }

    let dishes = this.state.dishes;
    let restaurants = [];
    for( let i = 0; i < dishes.length; i++){
      restaurants.push(dishes[i].restaurant.name);
    }
    restaurants = restaurants.reduce((x, y) => x.includes(y) ? x : [...x, y], []);

    restaurants.forEach((id)=>{
      if(document.getElementById(id))
      document.getElementById(id).checked = false;
    });

    restaurants = [];

    //reset price renge
    let price = Object.assign({}, this.state.price);    //creating copy of object
    price.min = 5;
    price.max = 50;

    let slider = document.getElementsByClassName('rc-slider-track rc-slider-track-1');
    if(slider.length >=1){
      slider[0].style.left = '5%';
      slider[0].style.width = '45%';
    }

    let priceRange1 = document.getElementsByClassName('rc-slider-handle rc-slider-handle-1');
    if(priceRange1.length >=1){
      priceRange1[0].style.left = '5%';
    }

    let priceRange2 = document.getElementsByClassName('rc-slider-handle rc-slider-handle-2');
    if(priceRange2.length >=1){
      priceRange2[0].style.left = '50%';
    }

    //reset ingredients
    let ingredients = Object.assign({}, this.state.ingredients);
    ingredients = '';
    document.getElementById('ingredientsSearch').value ='';

    //reset filtered Dishes
    let filteredDishes = this.state.dishes;
    this.setState({filteredDishes, restaurants, categories, price, ingredients});
  }

  getDishes() {
    this.resetFilters();
    
    this.setState({
      currentPage: 1,
      dishes: [],
      filteredDishes:[]
    });

    var data = document.getElementById('query');

    if( validator.isEmpty(data.value) ){
      this.query = data.value;

      fetch(`/api/dishes`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => {
        //console.log( json );
        
        this.setState({
          dishes : json,
          filteredDishes : json
        });
      });

    }else{    
      fetch(`/api/dishes?searchString=${data.value}`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => { 

        if(json) for(let i=0; i< json.length; i++){
          if(json[i].restaurant.constructor === Array )
            if(json[i].restaurant.length >=1) json[i].restaurant = json[i].restaurant[0];
        }

        this.setState({
          dishes : json,
          filteredDishes : json
        });
      }).catch(err => console.log(err));
    }    
  }

  deleteDish(index) {
    const id = this.state.dishes[index]._id;
    let prevData = this.state.dishes;
    
    fetch(`/api/dishes/${id}`, { method: 'DELETE'})
      .then(res => res.json())
      .then(json => {
        prevData.splice(index, 1);

        this.setState({
          dishes: prevData,
          filteredDishes : prevData
        })
      });
  }

  render(){
    // displaying current dishes
    const {filteredDishes, currentPage, dishesPerPage, dishes} = this.state;
    const indexOfLastDish = currentPage * dishesPerPage;
    const indexOfFirstDish = (currentPage - 1) * dishesPerPage;
    const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);
    const renderDishes = currentDishes.map((dish, i) => (
      <tr key={dish._id}>
          <td>{dish.restaurant.name}</td><td>{dish.categories}</td><td>{dish.name}</td>
          <td>{dish.ingredients}</td><td>{dish.price.currency}{' '}{dish.price.value}</td>
      </tr>
      ));
    
    //displaying current pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredDishes.length / dishesPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <PaginationItem key={number}> 
          <PaginationLink 
          href="#" 
          id={number}
          onClick={this.handleClickOnPage}>{number}
          </PaginationLink> 
        </PaginationItem>
      );
    });

    // displaying restaurant filter
    let restaurants = [];
    for( let i = 0; i < dishes.length; i++){
      restaurants.push(dishes[i].restaurant);
    }
    restaurants = restaurants.reduce((x, y) => {
      var found = false;
      for(var i = 0; i < x.length; i++) {
          if (x[i]._id == y._id) {
              found = true;
              break;
          }
      }      
      return found ? x : [...x, y]
    }, []);

    const renderRestaurantFilter = restaurants.map(restaurant => {  
      return (
      <div key={restaurant._id} >  
        <input className="m-l-7" type="checkbox" id={restaurant.name} value={restaurant.name} onClick={this.checkboxFilterToggle}></input>
        <span> </span>
        <label className="fs-12" htmlFor={restaurant.name}>{restaurant.name}</label>
      </div>
      );  
    });

    return(
      <React.Fragment>
      <div className="wrapper">
        <nav id="sidebar">
          <div className="sidebar-header">
              <h3>Dish Filter</h3>
          </div>

          <ul className="list-unstyled components">
              <li>
                <p className="txt8">Restaurants</p>
                  {renderRestaurantFilter}
              </li>
              <li>
                <p className="txt8">Category</p>
                  <div>
                    <input className="m-l-7" type="checkbox" id="appetizer" value="Appetizer" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="appetizer">Appetizer</label>
                    <input className="m-l-7" type="checkbox" id="salad" value="Salad" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="salad">Salad</label>
                  </div>
                  <div>
                    <input className="m-l-7" type="checkbox" id="pizza" value="Pizza" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="pizza">Pizza</label>
                    <input className="m-l-7" type="checkbox" id="pasta" value="Pasta" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="pasta">Pasta</label>
                    <input className="m-l-7" type="checkbox" id="sandwich" value="Sandwich" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="sandwich">Sandwich</label>
                  </div>
                  <div>
                    <input className="m-l-7" type="checkbox" id="mainCourse" value="MainCourse" onClick={this.checkboxToggle} />{'  '}
                    <label className="fs-12" htmlFor="mainCourse">Main Course</label>
                    <input className="m-l-7" type="checkbox" id="dessert" value="Dessert" onClick={this.checkboxToggle}/>{'  '}
                    <label className="fs-12" htmlFor="dessert">Dessert</label>
                  </div>
              </li>
              <li>
                <p className="txt8">Ingredients</p> 
                <Input style={filterTextStyle} bssize="sm" type="search" name="ingredients" id="ingredientsSearch" placeholder="z.b. Tomato" onChange={this.filterIngredients} />
              </li>
              <p className="txt8">Price ( $ )</p>    
              <li>
                <div style={wrapperStyle}>
                  <Range  min={0} max={100} defaultValue={[5, 50]} tipFormatter={value => `$${value}`} handle={handle} onChange={this.slideStateChange}/>
                </div>
              </li>
              <Button className="m-l-30 m-t-10" color="info" size="sm" onClick={this.checkFilters}>Apply</Button>
              <Button className="m-l-40 m-t-10" color="secondary" size="sm" onClick={this.resetFilters}>Reset</Button>
          </ul>
        </nav>
        <div style={divStyle}>
          <p className="tit3 t-center p-t-10">Dishes</p>
          <div>
            <nav className="navbar-expand-lg">
                <div className="m-l-10">
                    <Button size="sm" color="danger" type="button" id="sidebarCollapse" onClick={() => this.filterToggle()}>
                        <span>Filter</span>
                    </Button>
                </div>
            </nav>
          </div>
          <table className="dishes">
            <tbody>
              <tr>
              </tr>
              <tr>
                <td>
                <Form>
                  <FormGroup className="p-l-5 p-r-5">
                    <Label for="name" className="txt20"> Search </Label>
                    <Input type="text" name="query" id="query" placeholder="Input search keywords.." />
                  </FormGroup>        
                </Form>
                </td>
              </tr>
              <tr className="p-l-12">
                <td>
                  <Button className="m-l-5 m-b-5" color="primary" size="sm" onClick={() => this.getDishes()}>Get Dishes</Button>{' '}
                </td>
              </tr>          
            </tbody>
          </table>
          <table className="dishes">
              <thead>
              <tr>
              <th>Restaurant</th><th>Categorie</th><th>Dish Name</th><th>Ingredients</th><th>Price</th>
              {/* <th>Action</th> */}
              </tr>
              </thead>
              <tbody>
              {renderDishes}
                {/*this.state.filteredDishes.map((dish, i) => (
                <tr key={dish._id}>
                    <td>{dish.restaurant.name}</td><td>{dish.categories}</td><td>{dish.name}</td><td>{dish.ingredients}</td><td>{dish.price.currency}{' '}{dish.price.value}</td>
                     <td>
                        <Button outline color="danger" size="sm" onClick={() => this.deleteDish(i)}>Delete</Button>{' '}  
                    </td> 
                </tr>
                ))*/}
              </tbody>
          </table>
          <div className="p-t-20 p-b-20 flex-c-m">
              <Pagination size="sm" aria-label="Page navigation example">
                  <PaginationItem> <PaginationLink previous href="#" /> </PaginationItem>
                  {renderPageNumbers}
                  <PaginationItem> <PaginationLink next href="#" /> </PaginationItem>
              </Pagination> 
          </div>
        </div>
      </div>
      </React.Fragment>
    ); 
  }
}

export default Dishes;
