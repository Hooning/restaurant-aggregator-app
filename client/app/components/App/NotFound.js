import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <h2 className="txt1 t-center t-middle p-t-50 p-b-50 pos-relative">Page not found</h2>
    <p>
      <Link to="/" className="txt11 pos-relative m-l-10">Go home</Link>
    </p>
  </div>
);

export default NotFound;
