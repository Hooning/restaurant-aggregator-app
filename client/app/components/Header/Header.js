import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <Link to="/">Home</Link>
    <nav>
      <Link to="/helloworld">Hello World</Link>
    </nav>
    <nav>
      <Link to="/helloworld2">Hello World2</Link>
    </nav>

    <hr />
  </header>
);

export default Header;
