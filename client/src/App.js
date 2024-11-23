import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Branches from './pages/Branches';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/branches" element={<Branches />} />
      </Routes>
    </Router>
  );
}

export default App;
