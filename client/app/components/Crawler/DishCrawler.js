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

import Background from '../../images/blog-07.jpg';

const divStyle = {
    width: "100%",
    height: "500px",
    backgroundImage: `url( ${Background} )`,
    backgroundSize: "cover",
    backgroundPosition: "right top",
    backgroundRepeat: "no-repeat",
    position: "relative"
}

class DishCrawler extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      dishes: [],
    }
  }

  crawlDishes(){
    fetch('/api/crawlDishes', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(res => { data.value = "";return res.json();})
    .then(json => {
      console.log('# Client: fetch => newDish')
    });
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
       }
    })
    .then(res => {res.json(); data.value = "";})
    .then(json => {
      console.log('# Client: fetch => newDish')
    });
  }

  render(){
    return(
      <React.Fragment>
      <div style={divStyle}>
      <p className="tit3 t-center p-t-10">Dish Crawler</p>
        <Table className="dishes">
          <tbody>
            <tr>
              <td>
              <Form>
                <FormGroup>
                  <Label for="crawler" className="txt20"> Crawl Dishes</Label>
                </FormGroup>
              </Form>
              <Button color="danger" size="sm" onClick={() => this.crawlDishes()}>Crawl Dishes</Button>{' '}
              <Form>
                <FormGroup>
                  <Label for="manual" className="txt20 p-t-40"> Input Dishes</Label>
                  <Input type="textarea" name="dishes" id="dishes" placeholder="Input insert query for mongodb" />
                </FormGroup>
              </Form>
              <Button color="primary" size="sm" onClick={() => this.newDishes()}>New Dishes</Button>{' '}
              
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
