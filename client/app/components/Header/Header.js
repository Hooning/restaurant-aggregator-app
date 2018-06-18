import React from 'react';
import logo from '../../images/icons/logo.png'
import { Link } from 'react-router-dom';

const Header = () => (

  <header>
    <div className="wrap-menu-header gradient1 trans-0-3">
		<div className="container h-full .op-0-7">
			<div className="wrap_header trans-0-3">
				<div className="logo">
					<Link to="/">
						<img src={logo} alt={"logo"} data-logofixed="../../images/icons/logo2.png" />
					</Link>
				</div>
				<div className="wrap_menu p-l-45 p-l-0-xl">
					<nav className="menu">
						<ul className="main_menu">
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/restaurants">Restaurants</Link>
							</li>
							<li>
								<Link to="/dishes">Dishes</Link>
							</li>
							<li>
								<Link to="/dishcrawler">Dish Crawler</Link>
							</li>
						</ul>
					</nav>
				</div>
				<div className="responsive_menu">
					<button className="btn-resp-menu p-r-30 m-r-30"></button>
				</div>

			</div>
		</div>
	</div>
  </header>

);

export default Header;
