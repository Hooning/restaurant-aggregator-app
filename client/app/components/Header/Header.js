import React from 'react';
import logo from '../../images/icons/logo.png'
import { Link } from 'react-router-dom';

import Background from '../../images/icons/pattern1.png';

class Header extends React.Component{
  constructor(props) {
    super(props);

    this.state = {

    };
  }

	navbarToggle(event) {

		var ariaExpanded = event.target.getAttribute('aria-expanded');

		console.log(ariaExpanded);

		if ( ariaExpanded == 'true' ){
			var navbarNav = document.getElementById('navbarNav');
			navbarNav.classList.remove("show");
			document.getElementById('toggleBtn').setAttribute('aria-expanded', false);
		}else{
			var navbarNav = document.getElementById('navbarNav');
			navbarNav.classList.add("show");
			document.getElementById('toggleBtn').setAttribute('aria-expanded', true);
		}
	}

render(){

	return(
		<header>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<Link className="navbar-brand" to="/">
					<img src={logo} alt={"logo"} data-logofixed="../../images/icons/logo2.png" />
				</Link>
				<button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarNav" onClick={this.navbarToggle} aria-controls="navbarNav" aria-expanded="false" id="toggleBtn" aria-label="Toggle navigation" >
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item active">
							<Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/restaurants">Restaurants</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/dishes">Dishes</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link " to="/dishcrawler">Dish Crawler</Link>
						</li>
					</ul>
				</div>
			</nav>
		</header>
		
	)}
}

export default Header;
