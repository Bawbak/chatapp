const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const { auth } = require('./controllers/auth');

const port = process.env.PORT || 3000;

// Connect to DB
const connectDB = require('./models/config');
connectDB();

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Check the authorization for all the end points
app.use(auth);

// User Router
app.use('/user', require('./routes/user'));
// Register Router
app.use('/register', require('./routes/register'));
// Login Router
app.use('/login', require('./routes/login'));

// Home Router
app.get('/', (req, res) => {
  if(req.user)
    console.log('user authorized!');
  else
    console.log('guess user!');
  res.send('Home Page');
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
