import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/Loginpage/Loginpage';
import Navbar from './Navbar/Navbar';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import Budget from './Budget/Budget';
import React from 'react';
import Homepage from './Homepage/Homepage';
//Backend address: 161.35.188.98

function App() {
  return (
    <>
    <div class="hero">
        <h1>Personal Budget App</h1>
    </div>
    <div text-align ="center">

      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/homepage" element={<Homepage />} />
         
        </Routes>
      </Router>
    </div>    
    <footer class="bottom" text-align="center"> 
    <div class="row justify-content-center" text-align="center">
        All rights reserved &copy; Sai krishna
    </div>
    </footer>
    </>
  );
}
export default App;
