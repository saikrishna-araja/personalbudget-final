import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate();
  function logoutClick() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Register User</Link>
        </li>
        <li>
          <Link to="/budget">Create Budget</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>        
        <li>
          <Link to="/homepage">Homepage</Link>
        </li>
        <li>          
          <button border="visibility:none" align="right" onClick={logoutClick}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;