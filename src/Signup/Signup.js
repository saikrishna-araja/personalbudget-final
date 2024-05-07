import axios from 'axios';
import React, { useState } from 'react';

function Signup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRegistered,setUserRegistered] = useState('');
  //const server = 'http://localhost:3001/signup';
  const server = 'https://clownfish-app-fd9pz.ondigitalocean.app/api/signup';

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
      setPassword(event.target.value);
  }


const handleSubmit = (event) => {
  event.preventDefault();
  // Making call to backend to attempt to login
  axios.post(server, {
      username: username,
      password: password
  })
  .then(function(response) {
      console.log('success', response.data);
      setUserRegistered(true);
  })
  .catch(function(error) {
      console.log('fail', error);
      setUserRegistered(false);
  });
}

  return !userRegistered ?
    (<div className="App">
      <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
            <label htmlFor="username">Username: </label>
            <input aria-label={"usernameText"} type="text" id="username" value={username} onChange={handleUsernameChange} required/>
            </div>
            <br></br>
            <div className="row justify-content-center">
            <label htmlFor="password">Password: </label>
            <input aria-label={"passwordText"} type="text" id="password" value={password} onChange={handlePasswordChange} required/>
            </div>
            <br></br>
            <div className="row justify-content-center"><button type="submit">Register</button></div>
        </form>
    </div>)
    :
    ( 
      <div className="App">
        <h1>User registered successfully.</h1>
      </div>

    );
  
}

export default Signup;
