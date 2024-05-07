import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import pako from 'pako';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


function Dashboard() {
  //const server = 'http://localhost:3001/getbudget';
  const server = 'https://clownfish-app-fd9pz.ondigitalocean.app/api/getbudget';
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const [month,setMonth] = useState('');

  const options = {
    maintainAspectRatio: false
  }
  
  const handleMonthChange = (event) =>{
    setMonth(event.target.value);
  }

  const [dataSource, setDataSource] = useState ({
    labels: [],
    datasets: [
        {
        label: 'Budget',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
        hoverOffset: 4,
        borderWidth: 1
    }]
  });

  const [expenditure, setExpenditure] = useState ({
    labels: [],
    datasets: [
        {
        label: 'Expenditure',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
        hoverOffset: 4,
        borderWidth: 1
    }]
  });
  
  const redirectToBudget = () => {
    // Use the history.push() method to navigate to the /budget route
    navigate('/budget', {state: {username: username}});
  };

  //Check if token is valid
  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (!expirationTime) {
      return true; // No expiration time stored
    }
  
    const currentTime = new Date().getTime();
    return currentTime > parseInt(expirationTime, 10);
  };

  //Get budget data for charts
  const getBudget = async () => {
    try {
      const res = await axios.post(server, {
        username: username,
        month: month
      });
      const contentEncoding = res.headers['content-encoding'];

      let decompressedData;

      if (contentEncoding === 'gzip') {
        decompressedData = pako.ungzip(res.data, { to: 'string' });
      } else if (contentEncoding === 'deflate') {
        decompressedData = pako.inflate(res.data, { to: 'string' });
      } else {
        // No compression or unknown compression method
        decompressedData = res.data;
      }



      const newDataSource = {
        labels: res.data.map((item) => item.title),
        datasets: [
          {
            label: 'Budget',
            data: res.data.map((item) => item.budget),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            hoverOffset: 4,
            borderWidth: 1,
          },
        ],
      };

      setDataSource(newDataSource);

      const expenditureData = {
        labels: res.data.map((item) => item.title),
        datasets: [
          {
            label: 'Expenditure',
            data: res.data.map((item) => item.expenditure),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            hoverOffset: 4,
            borderWidth: 1,
          },
        ],
      };

      setExpenditure(expenditureData);
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Call the getBudget() function when the component is mounted if token present
    if (!token || isTokenExpired()) {
      localStorage.removeItem('username');
      localStorage.removeItem('expirationTime');
      localStorage.removeItem('token');
      navigate('/login');
    }
    else  {
      const expirationTime = parseInt(localStorage.getItem('expirationTime'), 10);
      const currentTime = new Date().getTime();
      const remainingTime = expirationTime - currentTime;

      if (remainingTime <= 40000) {
        const shouldRefresh = window.confirm("Your token is about to expire. Do you want to refresh it?");

        if (shouldRefresh) {
          localStorage.setItem('expirationTime', new Date().getTime() + 60000);

        }
      }
    }

  }, []);


  return (
    <div>
      <h1 text-align="center">Dashboard</h1>
      <div><button onClick={redirectToBudget}>Create Budget Items</button></div>
      <br></br>
      <div><button onClick={getBudget}>Get charts for </button></div>
      <div>
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
      
      <div style={{ display: 'inline-block', width: '300px', height: '300px' }}>
        <Pie data={dataSource} options={options} />
      </div>
      
      <div style={{ display: 'inline-block', width: '300px', height: '300px' }}>
        <Doughnut data={expenditure} options={options} />
      </div>
      
      <div style={{ display: 'inline-block', width: '300px', height: '300px' }}>
        <Bar data={dataSource} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
