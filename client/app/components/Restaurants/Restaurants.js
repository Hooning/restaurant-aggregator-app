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
  ListGroup,
  ListGroupItem
} from 'reactstrap';

import Background from '../../images/blog-05.jpg';

const divStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: `url( ${Background} )`,
  backgroundSize: "cover",
  backgroundPosition: "right top",
  backgroundRepeat: "no-repeat",
  position: "relative",
  textAlign: "center"
}

const imgStyle = {
  backgroundImage: `url( ${Background} )`,
}

class Restaurants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants : []
    };
  }

  getRestaurants() {
    fetch(`/api/restaurants`, {method: 'GET'})
      .then(res => res.json())
      .then(json => {
        //console.log( json );
        
        this.setState({
          restaurants : json,
        });
      });
  }

  componentDidMount(){
    this.getRestaurants();
  }

  render() {
    return (
      <div className="container trans-0-3" style={divStyle}>
        <p className="tit4 p-t-20">Restaurants</p>
        <div className="row">
        {this.state.restaurants.map((restaurant, i) => (
          // col-sm-4 col-md-14
          <div className="restaurants col-sm-4 col-md-auto" >
            <table>
              <tbody>
              <tr key={restaurant._id}>
                  <th colSpan="2" className="t-center t-middle fs-20">{restaurant.name}</th>
              </tr>
              <tr>
                <td colSpan="2" className="t-middle t-center">
                 <img src={require("../../images/"+restaurant.img)} className="restaurantImg"/>
                </td>
              </tr>
              <tr>
                  <th><i className="fa fa-map-marker fs-15 dis-inline-block size19" aria-hidden="true"></i></th>
                  <td className="fs-15 t-a-l">
                    {restaurant.address.street}{', '}
                    {restaurant.address.city}{', '}
                    {restaurant.address.state}{' '}
                    {restaurant.address.zip}
                  </td>
              </tr>
              <tr>
                  <th><i className="fa fa-phone fs-15 dis-inline-block size19" aria-hidden="true"></i></th>
                  <td className="fs-15 t-a-l">{restaurant.telephoneNumber}</td>
              </tr>
              </tbody>
            </table>
            {/* <Button outline color="danger" className="m-t-10" size="sm" onClick={() => this.deleteDish(i)}>See menus</Button>{' '}         */}
            
          </div>
        ))}
        </div>
      </div>
      
    );
  }
}

export default Restaurants;
