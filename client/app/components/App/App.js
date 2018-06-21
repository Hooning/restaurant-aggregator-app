import React, { Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const App = ({ children }) => (
  <>
    <Header />

    <main className="bg3">
      {children}
    </main>

    <Footer />
  </>
);

export default App;
