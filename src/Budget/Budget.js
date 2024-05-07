import React, { useState } from 'react';
import axios from 'axios';
import pako from 'pako';
import { useNavigate } from 'react-router-dom';

function Budget() {
    //const server = 'http://localhost:3001/makebudget';
    const server = 'https://clownfish-app-fd9pz.ondigitalocean.app/api/makebudget';

    const username = localStorage.getItem('username');

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [budget, setBudget] = useState('');
    const [expenditure, setExpenditure] = useState('');
    const [tags, setTags] = useState('');
    const [month,setMonth] = useState('');
    const [itemCreated,setItemCreated] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleBudgetChange = (event) => {
        setBudget(event.target.value);
    }

    const handleExpenditureChange = (event) => {
        setExpenditure(event.target.value);
    }

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    }

    const handleMonthChange = (event) =>{
        setMonth(event.target.value);
    }

    const redirectToDashboard = () => {
        // Use the history.push() method to navigate to the /budget route
        navigate('/dashboard', {state: {username: username}});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Making call to backend to attempt to login
        axios.post(server, {
            username: username,
            title: title,
            budget: budget,
            expenditure:expenditure,
            tags: tags,
            month: month,
            
        })
        .then(function(response) {
            const buffer = pako.inflate(new Uint8Array(response.data), { to: 'string' });
            console.log('success', response.data);
            setItemCreated(true);
        })
        .catch(function(error) {
            console.log('fail', error);
            setItemCreated(false);
        });
    }

  return  !itemCreated ?(
    <div>
      <div className="App">
            <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
                <label htmlFor="title">Title: </label>
                <input type="text" id="title" value={title} onChange={handleTitleChange} required/>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <label htmlFor="budget">Budget: </label>
                <input type="number" id="budget" value={budget} onChange={handleBudgetChange} required/>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <label htmlFor="spent">Spent: </label>
                <input type="number" id="spent" value={expenditure} onChange={handleExpenditureChange} required/>
            </div>
            <br></br>
            <div>
                <label htmlFor="month">Month: </label>
                <select name="month" id="month" defaultValue={""} onChange={handleMonthChange} required>
                    <option value="">Select a month</option>
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                </select>                
            </div>
            <br/>
            <div>
                <label htmlFor="tags">Tags: </label>
                <input type="text" id="tags" value={tags} onChange={handleTagsChange} required/>
            </div>
            <br/>
            <div className="row justify-content-center">   <button type="submit">Create Item</button> </div>
            </form>
        </div>
    </div>
  )
  :
  (
    <div className="App">
        <h1>Item created successfully.</h1>
        <div><button onClick={redirectToDashboard}>Go to Dashboard</button></div>
    </div>
    
  );
}

export default Budget;
