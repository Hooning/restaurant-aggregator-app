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

import Background from '../../images/bg-intro-01.jpg';

const divStyle = {
  width: "100%",
  height: "500px",
  backgroundImage: `url( ${Background} )`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  position: "relative",
  textAlign: "center"
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div className="bg1 container trans-0-5" style={divStyle}>
        <p className="tit4 p-t-120">
          Welcome to <br/>Little Italy 🍅
        </p>
      </div>
      
    );
  }
}

export default Home;
