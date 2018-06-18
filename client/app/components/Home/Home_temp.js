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


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counters: []
    };

    this.newCounter = this.newCounter.bind(this);
    this.incrementCounter = this.incrementCounter.bind(this);
    this.decrementCounter = this.decrementCounter.bind(this);
    this.deleteCounter = this.deleteCounter.bind(this);

    this._modifyCounter = this._modifyCounter.bind(this);
  }

  componentDidMount() {
    fetch('/api/counters')
      .then(res => res.json())
      .then(json => {
        this.setState({
          counters: json
        });
      });
  }

  newCounter() {
    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        console.log('# fetch =>')
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
  }

  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
        //console.log(json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }

  render() {
    return (
      <div>
        <p>Counters:</p>
        <ul>
          <ListGroup flush>
          {this.state.counters.map((counter, i) => (
            <ListGroupItem key={i}>
              <span>{counter.count}  </span>
              <Button outline color="primary" size="sm" onClick={() => this.incrementCounter(i)}>+</Button>{' '}
              <Button outline color="primary" size="sm" onClick={() => this.decrementCounter(i)}>-</Button>{' '}
              <Button color="danger" size="sm" onClick={() => this.deleteCounter(i)}>x</Button>{' '}
            </ListGroupItem>
          ))}
          </ListGroup>
        </ul>
        <Button className="m-b-20 m-l-20" color="secondary" onClick={this.newCounter}>New counter</Button>
        <div className="btn-back-to-top bg0-hov" id="myBtn">
          <span className="symbol-btn-back-to-top">
            <i className="fa fa-angle-double-up" aria-hidden="true"></i>
          </span>
        </div>
      </div>

      
    );
  }
}

export default Home;
