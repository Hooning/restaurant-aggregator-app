import React, { Component } from 'react';
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
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import validator from 'validator';

class DishCrawler extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      dishes: [],
    }
  }

  getDishes() {
    this.setState({
      dishes: [],
    });

    var data = document.getElementById('query');

    if( !validator.isJSON(data.value) && !validator.isEmpty(data.value)){
      alert("Invalid JSON format");
      data.value = "";
      data.focus();
      return;
    }

    if( validator.isEmpty(data.value) ){
      this.query = data.value;

      fetch(`/api/dishes`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => { 
        this.setState({
          dishes : json,
        });
      });

    }else{
      var params = JSON.parse(data.value);
      var esc = encodeURIComponent;
      this.query = Object.keys(params)
          .map(k => esc(k) + '=' + esc(params[k]))
          .join('&');

      fetch(`/api/dishes?${this.query}`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => { 
        this.setState({
          dishes : json,
        });
      });
    }    
  }

  newDishes() {
    var data = document.getElementById('dishes');
    
    if( validator.isEmpty(data.value) ){
      alert("Please input the value");
      data.value = "";
      data.focus();
      return;
    }

    if( !validator.isJSON(data.value) ){
      alert("Invalid JSON format");
      //data.value = "";
      data.focus();
      return;
    }

    fetch('/api/dishes', {
       method: 'POST',
       headers: {
         'Content-Type':'application/json'
       },
       body: data.value
    })
    .then(res => {res.json(); data.value = "";})
    .then(json => {
      console.log('# Client: fetch => newDish')
    });
  }

  deleteDish(index) {
    const id = this.state.dishes[index]._id;
    let prevData = this.state.dishes;
    
    fetch(`/api/dishes/${id}`, { method: 'DELETE'})
      .then(res => res.json())
      .then(json => {
        prevData.splice(index, 1);

        this.setState({
          dishes: prevData
        })
      });
  }

  render(){
    return(
      <React.Fragment>
      <div>
        <p>Crawler Test</p>
        <Table>
          <tbody>
            <tr>
              <td>
              <Form>
                <FormGroup>
                  <Label for="query"> Search Dishes</Label>
                  <Input type="text" name="query" id="query" placeholder="Input search query for mongodb" />
                </FormGroup>
              </Form>
              <Button color="primary" size="sm" onClick={() => this.getDishes()}>Get Dishes</Button>{' '}
              </td>
            </tr>          
          </tbody>
        </Table>
      </div>
      <Table size="sm">
        <thead>
        <tr>
          <th>Categorie</th><th>Dish Name</th><th>Ingredients</th><th>Price</th><th>Action</th>
        </tr>
        </thead>
        <tbody>
        {this.state.dishes.map((dish, i) => (
          <tr key={dish._id}>
              <td>{dish.categories}</td><td>{dish.name}</td><td>{dish.ingredients}</td><td>{dish.price.currency}{' '}{dish.price.value}</td>
              <td>
                <Button outline color="danger" size="sm" onClick={() => this.deleteDish(i)}>Delete</Button>{' '}  
              </td>
          </tr>
        ))}
        </tbody>
      </Table>
      <div>
        <Table>
          <tbody>
            <tr>
              <td>
              <Form>
                <FormGroup>
                  <Label for="dishes"> Input Dishes</Label>
                  <Input type="textarea" name="dishes" id="dishes" placeholder="Input insert query for mongodb" />
                </FormGroup>
              </Form>
              <Button color="secondary" size="sm" onClick={() => this.newDishes()}>New Dishes</Button>{' '}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      </React.Fragment>
    ); 
  }
  
}

export default DishCrawler;
