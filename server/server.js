//Final Backend Server
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {expressjwt: exjwt } = require('express-jwt');
var salt = bcrypt.genSaltSync(10);

const port = process.env.port || 3001;
const app = express();
app.use(compression()); 
app.use(express.json());
app.use(cors());

//Token generator
const secretKey = 'my secret key';
exjwt({
  secret: secretKey,
  algorithms: ['HS256']
})

//Pool for connections
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'sql5.freemysqlhosting.net',
    user : 'sql5704047',
    password : 'tBCV88knM8',
    database : 'sql5704047'
});

//Encrypts passwords
async function encryptPassword(password) {
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

//Turns signup date into sql format
function transformDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

function checkDuplicateUser(username) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM user WHERE username = ?', [username], function (error, results, fields) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(results.length);
      }
    });
  });
}

//Signup function for users
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body; 
  if (!username || !password) {
    res.status(400).json({ error: 'Both username and password are required' });
    return;
  }
  try {
    // Check if the username already sexist
    const count = await checkDuplicateUser(username);
    if (count > 0) {
      res.status(403).json({ error: 'Username is already taken' }); 
      return;
    }
    // If the username is unique, proceed with the insertion
    const hashedPassword = await encryptPassword(password);
    const date = transformDate(new Date());

    const insertUserQuery = 'INSERT INTO user (username, password, date) VALUES (?, ?, ?)';
    pool.query(insertUserQuery, [username, hashedPassword, date]);

    res.json({ success: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/refresh', async (req, res) => {
  const { username } = req.body; 
  if (!username) {
    res.status(400).json({ error: 'Username required' });
    return;
  }
  try {
    const expiresIn = 60;
      res.json({
        success: 'Refreshed',
        err: null,
        expiresIn
      })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Login function
app.post('/api/login', async (req, res) => {

  const { username, password } = req.body;
  if (!username || !password) { //Needs both username and password
      res.status(400).json({ error: 'Both username and password are required' });
      return;
  }   

  try { //Gets connection and finds user
    pool.getConnection(function(err, connection) {

      if (err) throw err;

      connection.query(
        'SELECT * FROM user WHERE username = ?',
        [username],
        async function (error, results, fields) {
          connection.release();
          if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          if (results.length > 0) { //If there is a user with username
            const user = results[0];
            const expiresIn = 60;
            const hashedPassword = user.password.toString();
            console.log(hashedPassword);
            const tokenPwd =await encryptPassword(password);
            console.log(tokenPwd);
            const matchPassword = await bcrypt.compare(password,hashedPassword);
            if (matchPassword) { //If passwords match
              const token = jwt.sign({ id: user.userid, username: user.username }, secretKey, {expiresIn: 60}); //Json web token expires in 60 seconds
              res.json({ 
                success: 'Login successful',
                err: null,
                token,
                expiresIn
             });
            } else { //If password does not match
              res.status(401).json({ error: 'Invalid password' });
          }
        } 
      }
    ); 
  })  
  } catch(err) {
    console.log(err);
  }
});

app.post('/api/makebudget', async(req, res) => {
  const {username, title, budget, tags} = req.body;
  if (!username) {
    res.status(400).json({ error: 'Username required.' });
      return;
  }

  try {
    pool.getConnection(function(err, connection) {
      if (err) throw err;

      connection.query('INSERT INTO budget (username, title, budget, tags) VALUES (?, ?, ?, ?)', 
      [username, title, budget, tags],
      async function(error, results, fields) {
        connection.release();
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        res.json({ success: 'Budget item created.' });
      })
    })
  } catch(error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/api/getbudget', async(req, res) => {
  const {username} = req.body;
  if (!username) {
    res.status(400).json({ error: 'Username required.' });
      return;
  }

  try {
    pool.getConnection(function(err, connection) {
      if (err) throw err;

      connection.query('SELECT * FROM budget WHERE username = ?', 
      [username],
      async function(error, results, fields) {
        connection.release();
        if (error) {
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        if (results.length > 0) {
          console.log(results);
          res.json(results);
        }
        else {
          console.log("No budget information found");
        }
      }
      )
    })
  } catch{

  }
})

app.listen(port, () => {
  console.log(`Server on port ${port}`)
});