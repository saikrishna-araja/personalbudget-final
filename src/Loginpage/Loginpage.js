import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pako from 'pako';

function Loginpage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //const server = 'http://localhost:3001/login';
    const server = 'https://clownfish-app-fd9pz.ondigitalocean.app/api/login';

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    //Making call to backend to attempt to login
    const handleSubmit = (event) => {
        event.preventDefault();
        // Making call to backend to attempt to login
        axios.post(server, {
            username: username,
            password: password
        })
        .then(async function(response) {
            //Checks if token is expired, if so, then sends back to login
            const buffer = await pako.inflate(new Uint8Array(response.data), { to: 'string', gzip: true });
            const expirationTime = new Date().getTime() + response.data.expiresIn * 1000; // Convert seconds to milliseconds
            localStorage.setItem('expirationTime', expirationTime);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            navigate('/dashboard');
        })
        .catch(function(error) {
            console.log('fail', error);
        });
    }

    return (
        <div className="App">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center">
                <label htmlFor="username">Username: </label>
                <input aria-label={"usernameText"} type="text" id="username" value={username} onChange={handleUsernameChange} required/>
                </div>
                <br></br>
                <div className="row justify-content-center ">
                <label htmlFor="password">Password: </label>
                <input aria-label={"passwordText"} type="password" id="password" value={password} onChange={handlePasswordChange} required/>
                </div>
                <br></br>
                <div className="row justify-content-center "><button type="submit">Login</button></div>
            </form>
        </div>
    );
}

export default Loginpage;