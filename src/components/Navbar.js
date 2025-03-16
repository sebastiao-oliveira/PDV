import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">PDV</Link></li>
        <li><Link to="/inventory">Estoque</Link></li>
        <li><Link to="/sales">Vendas</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
