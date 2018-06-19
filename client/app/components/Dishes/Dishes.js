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
  ListGroupItemText,
  Pagination, 
  PaginationItem, 
  PaginationLink 
} from 'reactstrap';
import validator from 'validator';

import Background from '../../images/blog-06.jpg';

const divStyle = {
    width: "100%",
    height: "500px",
    backgroundImage: `url( ${Background} )`,
    backgroundSize: "cover",
    backgroundPosition: "right top",
    backgroundRepeat: "no-repeat",
    position: "relative"
}

class Dishes extends React.Component{
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

    console.log("## data : " + data.value);

    if( validator.isEmpty(data.value) ){
      this.query = data.value;

      fetch(`/api/dishes`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => {
        console.log( json );
        
        this.setState({
          dishes : json,
        });
      });

    }else{
      //var params = JSON.parse(data.value);
      // var esc = encodeURIComponent;
      // this.query = Object.keys(params)
      //     .map(k => esc(k) + '=' + esc(params[k]))
      //     .join('&');
      //this.query = {"searchString": data.value};      

      fetch(`/api/dishes?searchString=${data.value}`, {method: 'GET'} )
      .then(res => res.json())
      .then(json => { 

        if(json) for(let i=0; i< json.length; i++){
          if(json[i].restaurant.constructor === Array )
            if(json[i].restaurant.length >=1) json[i].restaurant = json[i].restaurant[0];
        }

        this.setState({
          dishes : json,
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
          dishes: prevData
        })
      });
  }

  render(){
    return(
      <React.Fragment>
      <div style={divStyle}>
        <p className="tit3 t-center p-t-10">Dishes</p>
        <Table className="dishes">
          <tbody>
            <tr>
              <td>
              <Form>
                <FormGroup>
                  <Label for="name" className="txt20"> Search </Label>
                  <Input type="text" name="query" id="query" placeholder="Input dish name" />
                </FormGroup>        
              </Form>
              </td>
            </tr>
            <tr className="p-l-12">
              <td>
                <Button color="primary" size="sm" onClick={() => this.getDishes()}>Get Dishes</Button>{' '}
              </td>
            </tr>          
          </tbody>
        </Table>
        <Table size="sm" className="dishes">
            <thead>
            <tr>
            <th>Restaurant</th><th>Categorie</th><th>Dish Name</th><th>Ingredients</th><th>Price</th>
            {/* <th>Action</th> */}
            </tr>
            </thead>
            <tbody>
            {this.state.dishes.map((dish, i) => (
            <tr key={dish._id}>
                <td>{dish.restaurant.name}</td><td>{dish.categories}</td><td>{dish.name}</td><td>{dish.ingredients}</td><td>{dish.price.currency}{' '}{dish.price.value}</td>
                {/* <td>
                    <Button outline color="danger" size="sm" onClick={() => this.deleteDish(i)}>Delete</Button>{' '}  
                </td> */}
            </tr>
            ))}
            </tbody>
        </Table>
        <div className="p-t-20 p-b-20">
            <Pagination size="sm" aria-label="Page navigation example">
                <PaginationItem>
                <PaginationLink previous href="#" />
                </PaginationItem>
                <PaginationItem>
                <PaginationLink href="#">
                    1
                </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                <PaginationLink href="#">
                    2
                </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                <PaginationLink href="#">
                    3
                </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                <PaginationLink next href="#" />
                </PaginationItem>
            </Pagination>
        </div>
      </div>
      </React.Fragment>
    ); 
  }
  
}

export default Dishes;
