import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="flex">
      <span>You are not logged in</span>
      <nav>
        <Link to="/">Files</Link>
        <Link to="/">Logout</Link>
      </nav>
    </div>
  );
}

export default Navbar;
